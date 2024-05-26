import SignIn from "@/pages/user/SignIn";
import { signIn } from "@/apis/user/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { MockInstance, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/apis/user/auth", () => ({
	signIn: vi.fn(),
}));

vi.mock("@/utils/debounce", () => ({
	debounce: (fn: Function) => fn, // 디바운스를 무시하고 즉시 실행되도록 변경
}));

vi.mock("react-hot-toast");

describe("로그인 페이지 기능 테스트", () => {
	const queryClient = new QueryClient();
	const validEmail = "u1@market.com";
	const validPassword = "11111111";
	const invalidPassword = "111111";
	const successMessage = "로그인 성공!";
	const errorMessage = "로그인 실패";

	const renderSignInPage = () =>
		render(
			<RecoilRoot>
				<QueryClientProvider client={queryClient}>
					<MemoryRouter>
						<HelmetProvider>
							<SignIn />
						</HelmetProvider>
					</MemoryRouter>
				</QueryClientProvider>
			</RecoilRoot>,
		);

	const fillAndSubmitForm = async (email: string, password: string) => {
		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		await userEvent.type(emailInput, email);
		await userEvent.type(passwordInput, password);
		await userEvent.click(loginButton);
	};

	beforeEach(() => {
		vi.resetAllMocks();
		(signIn as unknown as MockInstance).mockImplementation(
			(email: string, password: string) => {
				if (email === validEmail && password === validPassword) {
					return Promise.resolve({
						ok: 1,
						item: {
							token: {
								accessToken: "access-token",
								refreshToken: "refresh-token",
							},
							_id: "user-id",
							name: "user-name",
						},
					});
				} else {
					return Promise.reject({
						response: {
							data: {
								message: errorMessage,
								errors: ["이메일 혹은 비밀번호가 정확하지 않습니다."],
							},
							status: 401,
						},
					});
				}
			},
		);
	});

	it("로그인 시 API 호출, 리디렉션 및 토스트 알림 출력 테스트", async () => {
		const toastSuccessSpy = vi.spyOn(toast, "success");

		renderSignInPage();
		await fillAndSubmitForm(validEmail, validPassword);

		await waitFor(() => {
			expect(signIn).toHaveBeenCalledWith(validEmail, validPassword);
			expect(window.location.pathname).toBe("/");
		});

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith(successMessage, {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		});
	});

	it("로그인 실패 시 토스트 알림 출력 테스트", async () => {
		const toastErrorSpy = vi.spyOn(toast, "error");

		renderSignInPage();
		await fillAndSubmitForm(validEmail, invalidPassword);

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(errorMessage, {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		});
	});
});
