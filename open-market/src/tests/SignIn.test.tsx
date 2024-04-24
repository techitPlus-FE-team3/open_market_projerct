import { HelmetProvider } from "react-helmet-async";
import SignIn from "@/pages/user/SignIn";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = (await vi.importActual("react-router-dom")) as object;
	return {
		...actual,
		Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		useNavigate: () => mockedNavigate,
	};
});

describe("로그인 테스트", async () => {
	it("로그인 페이지 렌더링 테스트", () => {
		render(
			<HelmetProvider>
				<SignIn />
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		// expect(screen.getByText("이메일")).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(loginButton).toBeInTheDocument();
	});

	it("로그인 페이지 값 입력 테스트", async () => {
		render(
			<HelmetProvider>
				<SignIn />
			</HelmetProvider>,
		);
		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");

		expect(emailInput).toHaveValue("u1@market.com");
		expect(passwordInput).toHaveValue("11111111");
	});

	it("폼 제출이 제대로 발생하는지 확인", async () => {
		const mockedSetItem = vi.fn();
		vi.stubGlobal("localStorage", {
			setItem: mockedSetItem,
		});
		const mockedPost = vi.fn(() =>
			Promise.resolve({
				data: {
					ok: 1,
					item: {
						token: { accessToken: "access123", refreshToken: "refresh123" },
					},
				},
			}),
		);
		vi.mock("@/utils/axiosInstance", () => ({
			post: mockedPost,
		}));

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

		// API 호출이 제대로 실행되었는지 확인
		await waitFor(() => {
			expect(mockedPost).toHaveBeenCalledWith("/users/login", {
				email: "u1@market.com",
				password: "11111111",
			});
		});

		// 로컬 스토리지와 리다이렉션 검증
		// expect(mockedSetItem).toHaveBeenCalledWith("accessToken", "access123");
		// expect(mockedSetItem).toHaveBeenCalledWith("refreshToken", "refresh123");
		// expect(mockedNavigate).toHaveBeenCalledWith("/");
	});
});
