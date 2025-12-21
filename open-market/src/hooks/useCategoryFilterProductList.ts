import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export interface CategoryFilterProductListProps {
	resource: string;
	category: string;
}

export const fetchFilterCategoryProductList = async ({
	resource,
	category,
}: CategoryFilterProductListProps) => {
	try {
		const { data } = await axiosInstance.get(
			`/${resource}?custom={"extra.category": "${category}"}`,
		);
		return data;
	} catch (error) {
		console.error("상품 리스트 조회 실패:", error);
	}
};

export function useCategoryFilterProductList({
	resource,
	category,
}: CategoryFilterProductListProps) {
	return useQuery({
		queryKey: ["products", { resource, category }],
		queryFn: () => fetchFilterCategoryProductList({ resource, category }),
		enabled: !!category && category.trim() !== "", // category가 유효할 때만 쿼리 실행
		retry: 1, // 에러 발생 시 1번만 재시도 (기본값 3번에서 감소)
		retryOnMount: false, // 마운트 시 자동 재시도 비활성화
	});
}
