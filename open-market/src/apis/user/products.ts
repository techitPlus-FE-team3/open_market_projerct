import { axiosInstance } from "@/utils";

export async function getUserProducts(): Promise<Product[] | undefined> {
	const response = await axiosInstance.get(`/seller/products/`);
	return response.data.item;
}
