import { axiosInstance } from "@/utils";

export async function loginUser(
	email: string,
	password: string,
): Promise<UserResponse> {
	const response = await axiosInstance.post<UserResponse>("/users/login", {
		email,
		password,
	});
	return response.data;
}
