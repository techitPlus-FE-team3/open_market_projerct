import { ProductEditForm } from "@/pages/product/ProductEdit";
import { axiosInstance } from "@/utils";

export interface ProductForm {
	show: boolean;
	active?: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	quantity: number;
	buyQuantity: number;
	extra: {
		sellerName: string;
		isNew?: boolean;
		isBest?: boolean;
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

export async function postProductDetail(newProductDetail: ProductForm) {
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

export function deleteProductDetail(productId?: string) {
	try {
		axiosInstance.delete(`/seller/products/${productId}`);
	} catch (error) {
		console.error(error);
	}
}

export async function patchProductDetail(
	productId?: string,
	newProductDetail?: ProductEditForm,
): Promise<string | undefined> {
	try {
		const response = await axiosInstance.patch(
			`/seller/products/${productId}`,
			newProductDetail,
		);
		return response.data.updated;
	} catch (error) {
		console.error(error);
	}
}
