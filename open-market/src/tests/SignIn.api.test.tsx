import SignIn from "@/pages/user/SignIn";
import { axiosInstance } from "@/utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock("@/utils/refreshToken.ts", () => ({
// 	axiosInstance: {
// 		post: vi.fn().mockImplementation((url, data) => {
// 			if (data.email === "u1@market.com" && data.password === "11111111") {
// 				return Promise.resolve({
// 					data: {
// 						ok: 1,
// 						item: {
// 							token: {
// 								accessToken: "access-token",
// 								refreshToken: "refresh-token",
// 							},
// 							_id: "user-id",
// 							name: "user-name",
// 						},
// 					},
// 				});
// 			} else {
// 				return Promise.reject({
// 					response: {
// 						data: {
// 							message: "로그인 실패",
// 							errors: [],
// 						},
// 						status: 401,
// 					},
// 				});
// 			}
// 		}),
// 	},
// }));

vi.mock("@/utils/debounce", () => ({
	debounce: (fn) => fn, // 디바운스를 무시하고 즉시 실행되도록 변경
}));

// vi.mock("@/utils/refreshToken");

vi.mock("react-hot-toast");

describe("SignIn 컴포넌트", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		axiosInstance.post = vi.fn(); // Ensure it's a mock function
	});

	it("로그인 시 API 호출과 결과 처리가 올바르게 수행되어야 합니다", async () => {
		// 테스트 별로 필요한 경우 여기에서 모킹을 재설정
		axiosInstance.post.mockImplementation((url, data) => {
			if (data.email === "u1@market.com" && data.password === "11111111") {
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
							errors: [],
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
						<SignIn />
					</HelmetProvider>
				</MemoryRouter>
			</RecoilRoot>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");

		// 클릭 이벤트 처리 전에 상태가 DOM에 반영될 시간 제공
		await new Promise((resolve) => setTimeout(resolve, 500));

		await userEvent.click(loginButton);

		await waitFor(() => {
			expect(axiosInstance.post).toHaveBeenCalledWith("/users/login", {
				email: "u1@market.com",
				password: "11111111",
			});
		});
		// 로그인 성공 메시지 확인
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"로그인 성공!",
				expect.anything(),
			);
		});
	});

	it("로그인 실패 시 적절한 오류 메시지를 출력해야 합니다", async () => {
		render(
			<RecoilRoot>
				<MemoryRouter>
					<HelmetProvider>
						<SignIn />
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
			expect(toast.error).toHaveBeenCalledWith(
				"알 수 없는 오류가 발생했습니다.",
			);
		});
	});
});
