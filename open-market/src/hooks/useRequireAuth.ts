import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useRequireAuth() {
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			toast.error("로그인이 필요한 서비스입니다.");
			// setTimeout(() => navigate("/signin"), 1500); // 토스트가 표시되는 동안 기다렸다가 리디렉트
			navigate("/signin");
		}
	}, [navigate]);
}
