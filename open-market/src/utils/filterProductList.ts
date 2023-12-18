export function searchProductList({
	searchKeyword,
	productList,
}: {
	searchKeyword: string;
	productList: Product[];
}) {
	searchKeyword = searchKeyword.toLowerCase();

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
	code,
	productList,
}: {
	code: string;
	productList: Product[];
}) {
	const filteredList = productList.filter((product) => {
		const productCategory = product.extra?.category!;
		if (productCategory?.includes(code)) {
			return true;
		}
		return false;
	});
	return filteredList;
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
// export function searchProductList({
// 	searchKeyword,
// 	productList,
// }: {
// 	searchKeyword: string;
// 	productList: Product[];
// }) {
// 	// 입력받은 searchKeyword를 소문자로 변환
// 	searchKeyword = searchKeyword.toLowerCase();

// 	const filteredList = productList.filter((product) => {
// 		const name = product.name.split(" ").join("").toLowerCase();
// 		const genre = product.extra?.category;
// 		const tags = product.extra?.tags;
// 		if (name.includes(searchKeyword) || genre?.includes(searchKeyword)) {
// 			return true;
// 		} else if (tags?.some((tag) => tag.toLowerCase().includes(searchKeyword))) {
// 			return true;
// 		}
// 		return false;
// 	});
// 	return filteredList;
// }

// export function categoryFilterProductList({
// 	code,
// 	productList,
// }: {
// 	code: string;
// 	productList: Product[];
// }) {
// 	// 입력받은 code를 소문자로 변환
// 	code = code.toLowerCase();

// 	const filteredList = productList.filter((product) => {
// 		const productCategory = product.extra?.category!;
// 		if (productCategory?.includes(code)) {
// 			return true;
// 		}
// 		return false;
// 	});
// 	return filteredList;
// }

// export function searchOrderList({
// 	searchKeyword,
// 	orderList,
// }: {
// 	searchKeyword: string;
// 	orderList: Order[];
// }) {
// 	// 입력받은 searchKeyword를 소문자로 변환
// 	searchKeyword = searchKeyword.toLowerCase();

// 	const filteredList = orderList.filter((order) => {
// 		const name = order.products[0].name.split(" ").join("").toLowerCase();
// 		const genre = order.products[0].extra?.category;
// 		const tags = order.products[0].extra?.tags;
// 		if (name.includes(searchKeyword) || genre?.includes(searchKeyword)) {
// 			return true;
// 		} else if (tags?.some((tag) => tag.toLowerCase().includes(searchKeyword))) {
// 			return true;
// 		}
// 		return false;
// 	});
// 	return filteredList;
// }
