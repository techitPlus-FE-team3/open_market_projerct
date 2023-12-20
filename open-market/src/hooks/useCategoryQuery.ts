import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const fetchCategory = async () => {
	const response = await axiosInstance.get(`/codes/productCategory`);
	const responseData = response.data.item;
	const categoryCodeList = responseData.productCategory.codes;

	return categoryCodeList;
};

export function useCategoryQuery() {
	return useQuery({ queryKey: ["category"], queryFn: fetchCategory });
}
