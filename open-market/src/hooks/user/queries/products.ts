import { getUserProducts } from "@/apis/user/products";
import { useQuery } from "@tanstack/react-query";

export function useUserProductsQuery() {
	return useQuery({
		queryKey: ["userProducts"],
		queryFn: () => getUserProducts(),
	});
}
