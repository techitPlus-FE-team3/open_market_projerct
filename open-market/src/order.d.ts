interface Order {
	_id: number;
	userId: number;
	createdAt: string;
	product: {
		productId: number;
		quantity: 1;
	};
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
