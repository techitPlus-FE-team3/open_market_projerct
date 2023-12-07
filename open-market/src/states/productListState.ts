import axiosInstance from "@/api/instance";
import { atom, selector } from "recoil";

export const productListState = atom<Product[]>({
	key: "productListState",
	default: [],
});

export const fetchproductListState = selector({
	key: "fetchproductListState",
	get: async () => {
		try {
			const response =
				await axiosInstance.get<ProductListResponse>("/products");
			return response.data.item;
		} catch (err) {
			console.error(err);
		}
	},
});

export const searchKeywordState = atom<string>({
	key: "searchKeywordState",
	default: "",
});

export const searchedProductListState = atom<Product[]>({
	key: "searchProductListState",
	default: [],
});
