import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

/**
 * SECURITY NOTE: Token Storage
 * 
 * 현재 구현은 localStorage에 토큰을 저장하고 있습니다.
 * 이는 XSS(Cross-Site Scripting) 공격에 취약할 수 있습니다.
 * 
 * 보안 개선 권장사항:
 * 1. httpOnly Cookie 사용 (백엔드 협업 필요) - 가장 권장
 * 2. Secure, SameSite 속성을 가진 Cookie 사용
 * 3. 토큰 만료 시간을 짧게 설정
 * 4. Content Security Policy (CSP) 헤더 설정
 * 
 * 참고: React는 JSX 렌더링 시 자동으로 XSS를 방지하지만,
 * localStorage에 저장된 데이터는 JavaScript로 접근 가능하므로 주의가 필요합니다.
 */

const API_KEY = import.meta.env.VITE_API_SERVER;

export const axiosInstance = axios.create({
	baseURL: API_KEY,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

type TokenRefreshCallback = (accessToken: string) => void;

function isAxiosError(error: any): error is AxiosError {
	return error.isAxiosError === true;
}

const logTokenExpiration = (
	token: string,
	logLevel: "info" | "debug" = "info",
) => {
	try {
		const decoded = jwtDecode<{ exp: number }>(token);
		const expiresAt = new Date(decoded.exp * 1000);
		if (logLevel === "info") {
			console.info("Token refreshed");
		} else if (logLevel === "debug") {
			console.debug(`Token expires at: ${expiresAt}`);
		}
	} catch (error) {
		console.error("Failed to decode token:", error);
	}
};

let isRefreshing = false;
let subscribers: TokenRefreshCallback[] = [];

function onAccessTokenFetched(accessToken: string): void {
	logTokenExpiration(accessToken, "info"); // 토큰 만료 시간 로깅 // For production
	// logTokenExpiration(accessToken, "debug"); // 토큰 만료 시간 로깅 // For development/debugging
	subscribers.forEach((callback) => callback(accessToken));
	subscribers = [];
}

function addSubscriber(callback: TokenRefreshCallback): void {
	subscribers.push(callback);
}

async function refreshAccessToken(): Promise<string> {
	if (isRefreshing) {
		return new Promise<string>((resolve) => {
			addSubscriber((accessToken: string) => {
				resolve(accessToken);
			});
		});
	}
	isRefreshing = true;

	try {
		const response = await axios.get(
			"https://modi-ip3-modi.koyeb.app/api/users/refresh",
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
				},
			},
		);
		const newAccessToken = response.data.accessToken;
		if (!response.data.ok || !newAccessToken) {
			throw new Error("Failed to refresh token");
		}
		// SECURITY: localStorage에 토큰 저장 (XSS 취약성 있음)
		// 향후 httpOnly Cookie 사용 권장
		localStorage.setItem("accessToken", newAccessToken);
		axiosInstance.defaults.headers.common["Authorization"] =
			`Bearer ${newAccessToken}`;
		onAccessTokenFetched(newAccessToken);
		return newAccessToken; // 갱신된 토큰 반환
	} catch (error) {
		if (isAxiosError(error)) {
			handleTokenRefreshError(error);
		} else {
			console.error("Unexpected error:", error);
			// 여기에 일반적인 에러 처리 로직
		}
		throw error;
	} finally {
		isRefreshing = false;
	}
}

function handleTokenRefreshError(error: AxiosError) {
	console.error("Error refreshing token:", error);
	let errorMessage = "토큰 갱신 중 문제가 발생했습니다. 다시 시도해주세요.";

	if (error.response) {
		const message = (error.response.data as { message?: string }).message;
		errorMessage =
			message || "토큰 갱신 중 문제가 발생했습니다. 다시 시도해주세요.";
	} else if (error.request) {
		errorMessage = "Network error. Please check your connection.";
	} else {
		errorMessage = error.message || errorMessage;
	}

	toast.error(errorMessage, {
		ariaProps: {
			role: "status",
			"aria-live": "polite",
		},
	});
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
}

axiosInstance.interceptors.request.use(
	(config) => {
		let accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		console.error("interceptors error", error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const newAccessToken = await refreshAccessToken();

				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
