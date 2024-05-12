import { getProductReplies } from "@/apis/product/replies";
import { useQuery } from "@tanstack/react-query";

export function useProductRepliesQuery(productId: string) {
	return useQuery({
		queryKey: ["productReplies"],
		queryFn: () => getProductReplies(productId),
	});
}
