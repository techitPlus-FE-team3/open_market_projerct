import { axiosInstance } from "@/utils";

export interface ProductRegistForm {
	show: boolean;
	active: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	quantity: number;
	buyQuantity: number;
	extra: {
		sellerName: string;
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
}

export async function getProductDetail(
	productId?: string,
): Promise<Product | undefined> {
	try {
		const response = await axiosInstance.get<ProductResponse>(
			`/products/${productId}`,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}

export async function postProductDetail(newProductDetail: ProductRegistForm) {
	try {
		const response = await axiosInstance.post(
			`/seller/products`,
			newProductDetail,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function deleteProductDetail(productId?: string) {
	try {
		axiosInstance.delete(`/seller/products/${productId}`);
	} catch (error) {
		console.error(error);
	}
}
