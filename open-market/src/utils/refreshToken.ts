import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "@/api/instance";

// 토큰 갱신 함수
async function refreshToken() {
	try {
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) {
			toast.error("토큰이 만료되었습니다. 다시 로그인해주세요.");
			throw new Error("No refresh token available.");
		}

		const response = await axiosInstance.get("/users/refresh", {
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});

		if (response.data.ok) {
			localStorage.setItem("accessToken", response.data.accessToken);
			// 글로벌 설정 대신 axiosInstance의 헤더를 갱신
			axiosInstance.defaults.headers.common["Authorization"] =
				`Bearer ${response.data.accessToken}`;

			return response.data.accessToken;
		} else {
			toast.error("토큰이 만료되었습니다. 다시 로그인해주세요.");
			throw new Error("Failed to refresh token");
		}
	} catch (error) {
		console.error("Error refreshing token:", error);
		// 에러 핸들링 로직 (예: 로그아웃 처리, 사용자에게 알림 등)
		toast.error("토큰이 만료되었습니다. 다시 로그인해주세요.");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("_id");
		window.location.href = "/signin";
		throw error;
	}
}

// 응답 인터셉터 설정

const interceptor = axiosInstance.interceptors.response.use(
	(response) => response, // 요청이 성공적인 경우 그대로 응답을 반환
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const newAccessToken = await refreshToken();
				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest); // 실패한 요청을 새 토큰으로 재시도
			} catch (refreshError) {
				window.location.href = "/signin";
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);

export default interceptor;
