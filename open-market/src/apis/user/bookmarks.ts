import { axiosInstance } from "@/utils";

export async function getUserBookmarks() {
	try {
		const response = await axiosInstance.get(`/bookmarks`);
		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}

export async function deleteUserBookmark(bookmarkId: string | number) {
	try {
		const response = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function postUserBookmark(
	currentUserId: string | number,
	productId: string | number,
) {
	try {
		const response = await axiosInstance.post(`/bookmarks/`, {
			user_id: currentUserId,
			product_id: productId,
			memo: "",
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
