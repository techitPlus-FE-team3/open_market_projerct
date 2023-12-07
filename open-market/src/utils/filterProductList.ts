export function searchProductList({
	searchKeyword,
	productList,
}: {
	searchKeyword: string;
	productList: Product[];
}) {
	const filteredList = productList.filter((product) => {
		const name = product.name.split(" ").join("").toLowerCase();
		const genre = product.extra?.category;
		const tags = product.extra?.tags;
		if (name.includes(searchKeyword) || genre?.includes(searchKeyword)) {
			return true;
		} else if (tags?.some((tag) => tag.toLowerCase().includes(searchKeyword))) {
			return true;
		}
		return false;
	});
	return filteredList;
}

export function categoryFilterProductList({
	category,
	productList,
}: {
	category: string;
	productList: Product[];
}) {
	const filteredList = productList.filter((product) => {
		const productCategory = product.extra?.category!;
		if (productCategory.includes(category)) {
			return true;
		}
		return false;
	});
	return filteredList;
}
