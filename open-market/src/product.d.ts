interface Product {
	_id: number;
	seller_id: number;
	show: boolean;
	name: string;
	mainImages: string[];
	content: string;
	price: number;
	createdAt: string;
	updatedAt: string;
	extra?: {
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		order: number;
		soundFile: string;
		bookmark: number;
	};
	replies?: Reply[];
}

interface ProductListResponse {
	ok: number;
	item: Product[];
}

interface ProductResponse {
	ok: number;
	item: Product;
}

interface Reply {
	_id: number;
	userId: number;
	productId: number;
	rating: number;
	content: string;
	createdAt: string;
	userName: string;
}
