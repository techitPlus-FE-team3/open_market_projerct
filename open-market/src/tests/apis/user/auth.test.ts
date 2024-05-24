import { signIn, signUp, updateUser } from "@/apis/user/auth";
import { axiosInstance } from "@/utils";
import { describe, it, expect, vi, Mock } from "vitest";
import { AxiosResponse } from "axios";

vi.mock("@/utils", () => ({
	axiosInstance: {
		post: vi.fn(),
		patch: vi.fn(),
	},
}));

describe("API 호출 함수 테스트", () => {
	it("로그인 API 호출", async () => {
		(axiosInstance.post as Mock).mockResolvedValue({
			data: { ok: 1, item: { token: { accessToken: "testToken" } } },
		} as AxiosResponse);

		const response = await signIn("test@example.com", "password123");
		expect(response.ok).toBe(1);
		expect(response.item.token.accessToken).toBe("testToken");
	});

	it("회원가입 API 호출", async () => {
		(axiosInstance.post as Mock).mockResolvedValue({
			data: { success: true },
		} as AxiosResponse);

		const response = await signUp({
			email: "test@example.com",
			password: "password123",
			name: "Test User",
			phone: "123-456-7890",
			type: "basic",
		});
		expect(response.success).toBe(true);
	});

	it("회원정보 수정 API 호출", async () => {
		(axiosInstance.patch as Mock).mockResolvedValue({
			data: { success: true },
		} as AxiosResponse);

		const response = await updateUser(1, {
			name: "newName",
			email: "newEmail@example.com",
			phone: "123-456-7890",
			extra: {
				profileImage: "newProfileImageUrl",
				terms: {
					recievingMarketingInformation: false,
					confirmAge: true,
				},
			},
		});
		expect(response.success).toBe(true);
	});
});
