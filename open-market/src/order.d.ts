interface Order {
	_id: number;
	user_id: number;
	createdAt: string;
	product: object[];
	cost: {
		total: number;
	};
}

interface OrderListResponse {
	ok: number;
	items: Order[];
}

interface OrderResponse {
	ok: number;
	item: Order;
}
