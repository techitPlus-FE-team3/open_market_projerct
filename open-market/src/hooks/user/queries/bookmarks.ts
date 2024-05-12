import { getUserBookmarks } from "@/apis/user/bookmarks";
import { useQuery } from "@tanstack/react-query";

export function useUserBookmarksQuery() {
	return useQuery({
		queryKey: ["userBookmarks"],
		queryFn: () => getUserBookmarks(),
	});
}
