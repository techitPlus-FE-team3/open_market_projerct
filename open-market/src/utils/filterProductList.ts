export function searchProductList({
	searchKeword,
	productList,
}: {
	searchKeword: string;
	productList: Product[];
}) {
	const filteredList = productList.filter((product) => {
		const name = product.name.split(" ").join("").toLowerCase();
		const genre = product.extra?.category;
		const tags = product.extra?.tags;
		if (name.includes(searchKeword) || genre?.includes(searchKeword)) {
			return true;
		} else if (tags?.some((tag) => tag.toLowerCase().includes(searchKeword))) {
			return true;
		}
		return false;
	});
	return filteredList;
}
