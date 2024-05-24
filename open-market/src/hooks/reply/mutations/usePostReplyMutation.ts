import { postProductReply } from "@/apis/product/replies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePostReplyMutation() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: postProductReply,

		onMutate: async (newReply: PostReply) => {
			await queryClient.cancelQueries({ queryKey: ["productReplies"] });
			const previousReplies = queryClient.getQueryData<Reply>([
				"productReplies",
			]);
			queryClient.setQueryData<PostReply[]>(
				["productReplies"],
				// undefined일 때는 빈배열 반환
				(prevReplies = []) => [...prevReplies, newReply],
			);
			return previousReplies;
		},

		onSuccess: () => {
			toast.success("댓글을 작성했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({ queryKey: ["productReplies"] });
		},

		onError: (error, _newReply, context: Reply | undefined) => {
			console.error(error);
			queryClient.setQueryData(["productReplies"], context);
		},
	});

	return mutation;
}
