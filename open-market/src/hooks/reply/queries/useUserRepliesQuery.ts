import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchUserReplies() {
	const response = await axiosInstance.get(`/replies`);
	return response.data.item;
}

export function useUserRepliesQuery() {
	return useQuery({
		queryKey: ["replies"],
		queryFn: () => fetchUserReplies(),
	});
}
