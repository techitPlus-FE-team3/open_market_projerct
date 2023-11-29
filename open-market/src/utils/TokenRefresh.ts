import axios from "axios";

// API 엔드포인트 주소
const API_ENDPOINT = "https://localhost/api/users/refresh";

// 토큰 갱신 함수
async function refreshToken() {
	try {
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) {
			alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
			throw new Error("No refresh token available.");
		}

		const response = await axios.get(API_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});

		if (response.data.ok) {
			localStorage.setItem("accessToken", response.data.accessToken);
			return response.data.accessToken;
		} else {
			alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
			throw new Error("Failed to refresh token");
		}
	} catch (error) {
		console.error("Error refreshing token:", error);
		// 에러 핸들링 로직 (예: 로그아웃 처리, 사용자에게 알림 등)
		alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
		throw error;
	}
}

export default refreshToken;
