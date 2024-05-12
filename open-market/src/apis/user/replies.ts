import { axiosInstance } from "@/utils";

export async function fetchUserReplies() {
	try {
		const response = await axiosInstance.get(`/replies`);
		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}
