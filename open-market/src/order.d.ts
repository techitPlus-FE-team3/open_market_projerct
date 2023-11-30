interface Order {
	_id: number;
	user_id: number;
	createdAt: string;
	products: Product[];
	cost: {
		total: number;
	};
}

interface OrderListResponse {
	ok: number;
	item: Order[];
}

interface OrderResponse {
	ok: number;
	item: Order;
}
