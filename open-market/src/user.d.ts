interface User {
	_id: number;
	email: string;
	password: string;
	name: string;
	phone: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	extra?: {
		profileImage: string;
		bookmarks?: number[];
		orders?: Order[];
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			cofirmAge: boolean;
		};
	};
	token: {
		accessToken: string;
		refreshToken: string;
	};
}

interface UserResponse {
	ok: number;
	item: User;
}
