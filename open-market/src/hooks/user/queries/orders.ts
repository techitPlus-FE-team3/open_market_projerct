import { getUserOrders } from "@/apis/user/orders";
import { useQuery } from "@tanstack/react-query";

export function useUserOrdersQuery() {
	return useQuery({
		queryKey: ["userOrders"],
		queryFn: () => getUserOrders(),
	});
}
