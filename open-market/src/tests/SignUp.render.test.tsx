import SignUp from "@/pages/user/SignUp";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = (await vi.importActual("react-router-dom")) as object;
	return {
		...actual,
		Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		useNavigate: () => mockedNavigate,
	};
});

vi.mock("react-hot-toast");

describe("회원가입 페이지 렌더링 테스트", () => {
	const queryClient = new QueryClient();
	let toastErrorSpy: any;

	beforeEach(() => {
		vi.clearAllMocks();
		toastErrorSpy = vi.spyOn(toast, "error");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("회원가입 페이지 입력 창 렌더링 테스트", () => {
		render(
			<HelmetProvider>
				<QueryClientProvider client={queryClient}>
					<SignUp />
				</QueryClientProvider>
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
		const nameInput = screen.getByPlaceholderText("이름");
		const phoneInput = screen.getByPlaceholderText("휴대폰 번호");
		const signUpButton = screen.getByRole("button", { name: "회원가입" });

		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(confirmPasswordInput).toBeInTheDocument();
		expect(nameInput).toBeInTheDocument();
		expect(phoneInput).toBeInTheDocument();
		expect(signUpButton).toBeInTheDocument();
	});

	it("회원가입 페이지 값 입력 테스트", async () => {
		render(
			<HelmetProvider>
				<QueryClientProvider client={queryClient}>
					<SignUp />
				</QueryClientProvider>
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
		const nameInput = screen.getByPlaceholderText("이름");
		const phoneInput = screen.getByPlaceholderText("휴대폰 번호");

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "password123");
		await userEvent.type(confirmPasswordInput, "password123");
		await userEvent.type(nameInput, "Test User");
		await userEvent.type(phoneInput, "01012345678");

		expect(emailInput).toHaveValue("test@example.com");
		expect(passwordInput).toHaveValue("password123");
		expect(confirmPasswordInput).toHaveValue("password123");
		expect(nameInput).toHaveValue("Test User");
		expect(phoneInput).toHaveValue("01012345678");
	});

	it("회원가입 유효성 검사 테스트", async () => {
		// const toastErrorSpy = vi.spyOn(toast, "error");

		render(
			<HelmetProvider>
				<QueryClientProvider client={queryClient}>
					<SignUp />
				</QueryClientProvider>
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
		const signUpButton = screen.getByRole("button", { name: "회원가입" });

		// Test for invalid email
		await userEvent.type(emailInput, "invalid-email");
		await userEvent.click(signUpButton);

		// Verify the error message for invalid email
		const emailErrorMessage =
			await screen.findByText("잘못된 입력값이 있습니다.");
		expect(emailErrorMessage).toBeInTheDocument();

		// Test for mismatched passwords
		await userEvent.clear(emailInput);
		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "password123");
		await userEvent.type(confirmPasswordInput, "password321");
		await userEvent.click(signUpButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"비밀번호가 일치하지 않습니다.",
				expect.objectContaining({
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				}),
			);
		});

		// Ensure the spy was called
		expect(toastErrorSpy).toHaveBeenCalled();
	});
});
