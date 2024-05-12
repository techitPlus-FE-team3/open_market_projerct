import { axiosInstance } from "@/utils";

export async function fetchProductReplies(productId?: string) {
	try {
		const response = await axiosInstance.get(`/replies/products/${productId}`);
		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}
