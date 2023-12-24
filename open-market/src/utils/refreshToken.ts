import axios from "axios";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_API_SERVER;

export const axiosInstance = axios.create({
	baseURL: API_KEY,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

let refreshingToken: any = null;

async function refreshToken() {
	if (refreshingToken) {
		return refreshingToken;
	}

	refreshingToken = axios
		.get("https://modi-ip3-modi.koyeb.app/api/users/refresh", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
			},
		})
		.then((response) => {
			if (response.data.ok) {
				const newAccessToken = response.data.accessToken;
				localStorage.setItem("accessToken", newAccessToken);
				currentAccessToken = newAccessToken;
				axiosInstance.defaults.headers.common["Authorization"] =
					`Bearer ${newAccessToken}`;
				return newAccessToken;
			} else {
				throw new Error("Failed to refresh token");
			}
		})
		.catch((error) => {
			handleTokenRefreshError(error);
			throw error;
		})
		.finally(() => {
			refreshingToken = null;
		});

	return refreshingToken;
}

function handleTokenRefreshError(error: any) {
	console.error("Error refreshing token:", error);
	const errorMessage =
		error.response && error.response.data
			? error.response.data.message
			: "토큰 갱신 중 문제가 발생했습니다. 다시 시도해주세요.";
	toast.error(errorMessage, {
		ariaProps: {
			role: "status",
			"aria-live": "polite",
		},
	});
	localStorage.clear();
}

let currentAccessToken = localStorage.getItem("accessToken");

axiosInstance.interceptors.request.use(
	(config) => {
		if (currentAccessToken) {
			config.headers["Authorization"] = `Bearer ${currentAccessToken}`;
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
				const newAccessToken = await refreshToken();
				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
