import {
	useMutation,
	useQueryClient,
	UseMutationResult,
	UseMutationOptions,
} from "@tanstack/react-query";
import { updateUser } from "@/apis/user/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { currentUserState } from "@/states/authState";

export function useUpdateUserMutation(): UseMutationResult<
	unknown,
	Error,
	UpdateUserRequest,
	unknown
> {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const mutationFn = async (newUserData: UpdateUserRequest) => {
		if (typeof currentUser?._id === "number") {
			return await updateUser(currentUser._id.toString(), newUserData);
		} else {
			throw new Error("Invalid user ID");
		}
	};

	const mutationOptions: UseMutationOptions<
		unknown,
		Error,
		UpdateUserRequest,
		unknown
	> = {
		onSuccess: (data, variables) => {
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
							profileImage: variables.profileImage ?? prev.profileImage,
						}
					: null,
			);
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
	};

	return useMutation<unknown, Error, UpdateUserRequest>(
		mutationFn,
		mutationOptions,
	);
}
