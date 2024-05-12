import { axiosInstance } from "@/utils";

export async function loginUser(
	email: string,
	password: string,
): Promise<User> {
	const response = await axiosInstance.post<UserResponse>("/users/login", {
		email,
		password,
	});
	if (response.data.ok !== 1) {
		throw new Error("로그인 실패: 유효하지 않은 응답");
	}
	return response.data.item;
}
