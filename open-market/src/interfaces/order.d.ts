interface Order {
	_id: number;
	user_id: number;
	state?: string;
	createdAt: string;
	updatedAt: string;
	products: Product[];
	cost: {
		products: number;
		shippongFees: 0;
	};
	total: number;
}

interface OrderListResponse {
	ok: number;
	item: Order[];
}

interface OrderResponse {
	ok: number;
	item: Order;
}
