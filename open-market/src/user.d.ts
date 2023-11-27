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
	user: User;
}
