interface Product {
	_id: number;
	seller_id: number;
	show: boolean;
	active: boolean;
	name: string;
	mainImages: string[];
	image?: string;
	content: string;
	quantity: number;
	buyQuantity: number;
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
	order_id: number;
	user_id: number;
	product_id: number;
	rating: number;
	content: string;
	createdAt: string;
	userName: string;
}

interface ReplyResponse {
	ok: number;
	item: Reply;
}
