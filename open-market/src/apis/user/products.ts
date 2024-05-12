import { axiosInstance } from "@/utils";

export async function getUserProducts() {
	const response = await axiosInstance.get(`/seller/products/`);
	return response.data.item;
}
