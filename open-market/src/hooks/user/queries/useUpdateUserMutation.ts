import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/apis/user/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { currentUserState } from "@/states/authState";

export function useUpdateUserMutation() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const mutationFn = async (newUserData) => {
		if (currentUser?._id) {
			return await updateUser(currentUser._id, newUserData);
		} else {
			throw new Error("Invalid user ID");
		}
	};

	const mutationOptions = {
		onSuccess: (_data, variables) => {
			toast.success("회원 정보가 수정되었습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({ queryKey: ["userData"] });
			setCurrentUser((prev) =>
				prev
					? {
							...prev,
							profileImage: variables.extra.profileImage ?? prev.profileImage,
						}
					: null,
			);
			navigate("/mypage");
		},
		onError: (error) => {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	};

	return useMutation(mutationFn, mutationOptions);
}
