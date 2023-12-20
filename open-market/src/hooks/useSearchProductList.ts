import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

interface SearchedProductListProps {
	resource: string;
	searchKeyword: string;
}
const searchProductList = async ({
	resource,
	searchKeyword,
}: SearchedProductListProps) => {
	if (resource && searchKeyword) {
		const [responseKeyword, responseTags] = await Promise.all([
			axiosInstance.get(`/${resource}?keyword=${searchKeyword}`),
			axiosInstance.get(
				`/${resource}?custom={"extra.tags":"${searchKeyword}"}`,
			),
		]);

		const searchedKeywordData = responseKeyword.data.item;
		const searchedTagsData = responseTags.data.item;

		const combinedData = [...searchedKeywordData, ...searchedTagsData];

		const uniqueData = combinedData.filter((item, index) => {
			return combinedData.findIndex((i) => i._id === item._id) === index;
		});

		return uniqueData;
	}
};

export function useSearchProductList({
	resource,
	searchKeyword,
}: SearchedProductListProps) {
	return useQuery({
		queryKey: ["searchProductList", resource, searchKeyword],
		queryFn: async () => {
			try {
				const result = await searchProductList({ resource, searchKeyword });
				return result;
			} catch (error) {
				// 에러가 발생한 경우 error 속성에 에러를 설정
				throw error;
			}
		},
	});
}
