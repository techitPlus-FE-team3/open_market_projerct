import { axiosInstance } from ".";

export async function searchProductList({
	resource,
	searchKeyword,
}: {
	resource: string;
	searchKeyword: string;
}) {
	if (resource && searchKeyword) {
		try {
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
		} catch (error) {
			console.error("상품 리스트 조회 실패:", error);
		}
	}
}

export async function categoryFilterProductList({
	resource,
	category,
}: {
	resource: string;
	category: string;
}) {
	try {
		const responseCategory = await axiosInstance.get(
			`/${resource}?custom={"extra.category": "${category}"}`,
		);
		const filteredCategoryData = responseCategory.data.item;

		return filteredCategoryData;
	} catch (error) {
		console.error("상품 리스트 조회 실패:", error);
	}
}

export function searchOrderList({
	searchKeyword,
	orderList,
}: {
	searchKeyword: string;
	orderList: Order[];
}) {
	const filteredList = orderList.filter((order) => {
		const name = order.products[0].name.split(" ").join("").toLowerCase();
		const genre = order.products[0].extra?.category;
		const tags = order.products[0].extra?.tags;
		if (name.includes(searchKeyword) || genre?.includes(searchKeyword)) {
			return true;
		} else if (tags?.some((tag) => tag.toLowerCase().includes(searchKeyword))) {
			return true;
		}
		return false;
	});
	return filteredList;
}
