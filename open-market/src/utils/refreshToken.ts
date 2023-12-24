import axios from "axios";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_API_SERVER;

export const axiosInstance = axios.create({
	baseURL: API_KEY,
	timeout: 1000 * 5,
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

	try {
		refreshingToken = axiosInstance.get("/users/refresh", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
			},
		});

		const response = await refreshingToken;

		if (response.data.ok) {
			localStorage.setItem("accessToken", response.data.accessToken);
			axiosInstance.defaults.headers.common["Authorization"] =
				`Bearer ${response.data.accessToken}`;
			refreshingToken = null;
			return response.data.accessToken;
		} else {
			throw new Error("Failed to refresh token");
		}
	} catch (error) {
		handleTokenRefreshError(error);
		throw error;
	} finally {
		refreshingToken = null;
	}
}

function handleTokenRefreshError(error: any) {
	console.error("Error refreshing token:", error);
	toast.error("토큰이 만료되었습니다. 다시 로그인해주세요.", {
		ariaProps: {
			role: "status",
			"aria-live": "polite",
		},
	});
	localStorage.clear();
}

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
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
				await refreshToken();
				originalRequest.headers["Authorization"] =
					`Bearer ${localStorage.getItem("accessToken")}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
