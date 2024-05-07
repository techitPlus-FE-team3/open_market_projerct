import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchProductReplies(productId: string) {
	const response = await axiosInstance.get(`/replies/products/${productId}`);
	return response.data.item;
}

export function useProductRepliesQuery(productId: string) {
	return useQuery({
		queryKey: ["productReplies"],
		queryFn: () => fetchProductReplies(productId),
	});
}
