import { axiosInstance } from "@/utils";

export async function getUserOrders(): Promise<Order[] | undefined> {
	const response = await axiosInstance.get(`/orders`);
	return response.data.item;
}
