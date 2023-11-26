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
		bookmarks?: number[];
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			cofirmAge: boolean;
		};
	};
}

interface UserResponse {
	ok: number;
	user: User;
}
