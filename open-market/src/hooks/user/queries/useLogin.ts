import { loginUser } from "@/apis/user/auth";
import { currentUserState } from "@/states/authState";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const useLogin = (email: string, password: string) => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const navigate = useNavigate();

	const { data, error, isError, isSuccess, refetch } = useQuery({
		queryKey: ["login", email, password],
		queryFn: () => loginUser(email, password),
		enabled: false,
	});

	useEffect(() => {
		if (isSuccess && data) {
			localStorage.setItem("accessToken", data.token.accessToken);
			localStorage.setItem("refreshToken", data.token.refreshToken);
			setCurrentUser({
				_id: data._id,
				name: data.name,
				profileImage: data.extra?.profileImage || null,
			});
			toast.success("로그인 성공!");
			navigate("/");
		}
		if (isError && error instanceof Error) {
			toast.error(`로그인 실패: ${error.message}`);
		}
	}, [isSuccess, isError, data, error, navigate, setCurrentUser]);

	return { data, error, isError, isSuccess, refetch };
};
