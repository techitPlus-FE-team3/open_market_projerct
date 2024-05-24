import SignIn from "@/pages/user/SignIn";
import { signIn } from "@/apis/user/auth";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi, Mock } from "vitest";

vi.mock("@/apis/user/auth", () => ({
	signIn: vi.fn(),
}));

vi.mock("@/utils/debounce", () => ({
	debounce: (fn: Function) => fn, // 디바운스를 무시하고 즉시 실행되도록 변경
}));

// vi.mock("react-hot-toast");

vi.mock("react-hot-toast", () => ({
	success: vi.fn(),
	error: vi.fn(),
}));

describe("로그인 페이지 기능 테스트", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		vi.resetAllMocks();
		queryClient = new QueryClient();
	});

	it("로그인 시 API 호출, 리디렉션 및 토스트 알림 출력 테스트", async () => {
		(signIn as Mock).mockImplementation((email: string, password: string) => {
			if (email === "u1@market.com" && password === "11111111") {
				return Promise.resolve({
					data: {
						ok: 1,
						item: {
							token: {
								accessToken: "access-token",
								refreshToken: "refresh-token",
							},
							_id: "user-id",
							name: "user-name",
						},
					},
				});
			} else {
				return Promise.reject({
					response: {
						data: {
							message: "로그인 실패",
							errors: ["이메일 혹은 비밀번호가 정확하지 않습니다."],
						},
						status: 401,
					},
				});
			}
		});

		render(
			<RecoilRoot>
				<MemoryRouter>
					<HelmetProvider>
						<QueryClientProvider client={queryClient}>
							<SignIn />
						</QueryClientProvider>
					</HelmetProvider>
				</MemoryRouter>
			</RecoilRoot>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");

		await userEvent.click(loginButton);

		await waitFor(() => {
			expect(signIn).toHaveBeenCalledWith("u1@market.com", "11111111");
		});

		// 로그인 성공 메시지 확인
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"로그인 성공!",
				expect.anything(),
			);
		});

		await waitFor(() => {
			expect(window.location.pathname).toBe("/");
		});
	});

	it("로그인 실패 시 토스트 알림 출력 테스트", async () => {
		(signIn as Mock).mockImplementation(() => {
			return Promise.reject({
				response: {
					data: {
						message: "로그인 실패",
						errors: ["이메일 혹은 비밀번호가 정확하지 않습니다."],
					},
					status: 401,
				},
			});
		});

		render(
			<RecoilRoot>
				<MemoryRouter>
					<HelmetProvider>
						<QueryClientProvider client={queryClient}>
							<SignIn />
						</QueryClientProvider>
					</HelmetProvider>
				</MemoryRouter>
			</RecoilRoot>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "111111");
		await userEvent.click(loginButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("로그인 실패");
		});
	});
});
