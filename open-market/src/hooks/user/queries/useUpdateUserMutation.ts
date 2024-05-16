import { updateUser } from "@/apis/user/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useUpdateUserMutation() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: { userId: string; userData: UpdateUserRequest }) =>
			updateUser(data.userId, data.userData),
		onSuccess: () => {
			toast.success("회원 정보가 수정되었습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			navigate("/mypage");
		},
		onError: (error: any) => {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	});
}
