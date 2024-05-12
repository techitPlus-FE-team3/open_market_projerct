import { axiosInstance } from "@/utils";

export async function getUserBookmarks() {
	const response = await axiosInstance.get(`/bookmarks`);
	return response.data.item;
}
