import { HelmetProvider } from "react-helmet-async";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "@/pages/user/SignIn";
import { toast } from "react-hot-toast"; // 필요에 따라 추가

// Define a minimal type for the react-hot-toast module
type Toast = {
	success: (message: string) => void;
	error: (message: string) => void;
};

// 테스트 파일에서 debounce 함수 모킹
vi.mock("@/utils/debounce", () => ({
	debounce: (fn: Function) => fn, // 즉시 실행을 위해 debounce를 bypass
}));

// axiosInstance mocking
vi.mock("@/utils/axiosInstance", () => ({
	post: vi.fn(() =>
		Promise.resolve({
			data: {
				ok: true,
				item: {
					token: { accessToken: "token123", refreshToken: "refreshToken123" },
				},
			},
		}),
	),
}));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = (await vi.importActual("react-router-dom")) as object;
	return {
		...actual,
		Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		useNavigate: () => mockedNavigate,
	};
});

// Correcting the toast mock with type
vi.mock("react-hot-toast", async (importOriginal) => {
	const actual = (await importOriginal()) as { toast: Toast }; // Correctly type the import
	return {
		...actual,
		toast: {
			...actual.toast,
			success: vi.fn(),
			error: vi.fn(),
		},
	};
});

// LocalStorage 모킹
vi.stubGlobal("localStorage", {
	getItem: vi.fn().mockImplementation((key) => {
		if (key === "accessToken") return "token123";
		return null;
	}),
	setItem: vi.fn(),
	removeItem: vi.fn(),
});

describe("SignIn Component", () => {
	beforeEach(() => {
		vi.mock("@/utils/axiosInstance", () => ({
			post: vi.fn(() =>
				Promise.resolve({
					data: {
						ok: true,
						item: {
							token: {
								accessToken: "token123",
								refreshToken: "refreshToken123",
							},
						},
					},
				}),
			),
		}));
		// Console mocking
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		// Restore the original implementation
		vi.restoreAllMocks();
	});
	it("should allow a user to log in and navigate to the home page", async () => {
		render(
			<HelmetProvider>
				<SignIn />
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");
		await userEvent.click(loginButton);

		// await waitFor(
		// 	() => {
		// 		expect(localStorage.getItem("accessToken")).toBe("token123");
		// 		// expect(mockedNavigate).toHaveBeenCalledWith("/");
		// 	},
		// 	{ timeout: 500 },
		// );

		// expect(await screen.findByText("로그인 성공!")).toBeInTheDocument();
		// expect(vi.mocked(toast.success).mock.calls.length).toBeGreaterThan(0);

		// await waitFor(
		// 	() => {
		// 		expect(vi.mocked(toast.success).mock.calls.length).toBeGreaterThan(0);
		// 	},
		// 	{ timeout: 1000 },
		// ); // 필요에 따라 타임아웃 증가

		// expect(console.log).toHaveBeenCalledWith(
		// 	"로그인 성공:",
		// 	expect.any(Object),
		// );

		await waitFor(
			() => {
				expect(console.log).toHaveBeenCalledWith("로그인 성공:");
			},
			{ timeout: 1000 },
		);
	});

	// it("should log error on login failure", async () => {
	// 	// Change the implementation for the test to simulate a failure
	// 	vi.mock("@/utils/axiosInstance", () => ({
	// 		post: vi.fn(() =>
	// 			Promise.reject({
	// 				response: {
	// 					data: {
	// 						message: "Invalid credentials",
	// 						errors: [{ msg: "Invalid email or password", path: "email" }],
	// 					},
	// 				},
	// 			}),
	// 		),
	// 	}));

	// 	render(
	// 		<HelmetProvider>
	// 			<SignIn />
	// 		</HelmetProvider>,
	// 	);

	// 	const emailInput = screen.getByLabelText("이메일");
	// 	const passwordInput = screen.getByLabelText("비밀번호");
	// 	const loginButton = screen.getByRole("button", { name: "로그인" });

	// 	// Simulate user input
	// 	await userEvent.type(emailInput, "test@example.com");
	// 	await userEvent.type(passwordInput, "wrongpassword");
	// 	await userEvent.click(loginButton);

	// 	// Check if the error log is called
	// 	await waitFor(() => {
	// 		expect(console.log).toHaveBeenCalledWith(
	// 			"로그인 성공:",
	// 			expect.any(Object),
	// 		);
	// 	});
	// });
});
