import { signIn } from "@/apis/user/auth";
import { currentUserState } from "@/states/authState";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export function useSignInMutation() {
	const navigate = useNavigate();
	const setCurrentUser = useSetRecoilState(currentUserState);

	return useMutation({
		mutationFn: (credentials: { email: string; password: string }) =>
			signIn(credentials.email, credentials.password),
		onSuccess: (data) => {
			if (data.ok === 1 && data.item.token) {
				const userInfo = data.item;

				// SECURITY: localStorage에 토큰 저장 (XSS 취약성 있음)
				// 향후 httpOnly Cookie 사용 권장
				localStorage.setItem("accessToken", userInfo.token.accessToken);
				localStorage.setItem("refreshToken", userInfo.token.refreshToken);

				toast.success("로그인 성공!");
				setCurrentUser({
					_id: userInfo._id,
					name: userInfo.name,
					profileImage: userInfo.extra?.profileImage || null,
				});
				navigate("/");
			}
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
			toast.error(errorMessage);
		},
	});
}
