import SignUp from "@/pages/user/SignUp";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	const renderSignUp = () => {
		render(
			<HelmetProvider>
				<QueryClientProvider client={queryClient}>
					<SignUp />
					<Toaster />
				</QueryClientProvider>
			</HelmetProvider>,
		);
	};

	it("회원가입 페이지 입력 창 렌더링 테스트", () => {
		renderSignUp();

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
		renderSignUp();

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

	it("이메일 유효성 검사 테스트", async () => {
		renderSignUp();

		const emailInput = screen.getByLabelText("이메일");
		const signUpButton = screen.getByRole("button", { name: "회원가입" });

		// Test for invalid email
		await userEvent.type(emailInput, "invalid-email");
		await userEvent.click(signUpButton);

		// Verify the error message for invalid email
		const emailErrorMessage =
			await screen.findByText("잘못된 입력값이 있습니다.");
		expect(emailErrorMessage).toBeInTheDocument();
	});

	it("비밀번호 확인 칸 일치 검사 테스트", async () => {
		const toastErrorSpy = vi.spyOn(toast, "error");

		renderSignUp();

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
		const signUpButton = screen.getByRole("button", { name: "회원가입" });

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "password123");
		await userEvent.type(confirmPasswordInput, "password321");

		await act(async () => {
			await userEvent.click(signUpButton);
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(
				"비밀번호가 일치하지 않습니다.",
				{
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				},
			);
		});

		// expect(toastErrorSpy).toHaveBeenCalled();
	});
});
