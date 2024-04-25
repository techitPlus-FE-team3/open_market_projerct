import SignIn from "@/pages/user/SignIn";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/utils/refreshToken";

// vi.mock("axios", () => {
// 	const originalModule = vi.importActual("axios"); // 원본 모듈 가져오기
// 	return {
// 		...originalModule, // 모든 기존 내보내기 포함
// 		default: {
// 			...originalModule.default,
// 			create: () => ({
// 				post: vi.fn(() =>
// 					Promise.resolve({
// 						data: {
// 							ok: true,
// 							item: {
// 								token: {
// 									accessToken: "access-token",
// 									refreshToken: "refresh-token",
// 								},
// 								_id: "user-id",
// 								name: "user-name",
// 							},
// 						},
// 					}),
// 				),
// 				interceptors: {
// 					request: { use: vi.fn() },
// 					response: { use: vi.fn() },
// 				},
// 			}),
// 		},
// 	};
// });

// vi.mock("axios", () => ({
// 	__esModule: true, // ES 모듈 시뮬레이션
// 	default: {
// 		create: () => ({
// 			post: vi.fn(),
// 		}),
// 		post: vi.fn(),
// 	},
// }));

// vi.mock("@/utils/refreshToken", () => ({
// 	axiosInstance: {
// 		post: vi.fn().mockImplementation(() =>
// 			Promise.resolve({
// 				data: {
// 					ok: true,
// 					item: {
// 						token: {
// 							accessToken: "access-token",
// 							refreshToken: "refresh-token",
// 						},
// 						_id: "user-id",
// 						name: "user-name",
// 					},
// 				},
// 			}),
// 		),
// 		interceptors: {
// 			request: {
// 				use: vi.fn(),
// 			},
// 			response: {
// 				use: vi.fn(),
// 			},
// 		},
// 	},
// }));

// vi.mock("@/utils/refreshToken", () => ({
// 	axiosInstance: {
// 		post: vi.fn(),
// 		interceptors: {
// 			request: { use: vi.fn() },
// 			response: { use: vi.fn() },
// 		},
// 	},
// }));

vi.mock("@/utils/refreshToken");

vi.mock("react-hot-toast");

describe("SignIn 컴포넌트", () => {
	beforeEach(() => {
		vi.resetAllMocks(); // Resets all mocks before each test

		// Set default mock behaviors
		const axiosInstance = require("@/utils/refreshToken").axiosInstance;
		axiosInstance.post.mockImplementation((url, data) => {
			if (data.email === "u1@market.com" && data.password === "11111111") {
				return Promise.resolve({
					data: {
						ok: true,
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
						status: 401,
						data: { message: "로그인 실패" },
					},
				});
			}
		});
	});

	it("로그인 시 API 호출과 결과 처리가 올바르게 수행되어야 합니다", async () => {
		// const mockResponse = {
		// 	data: {
		// 		ok: true,
		// 		item: {
		// 			token: {
		// 				accessToken: "access-token",
		// 				refreshToken: "refresh-token",
		// 			},
		// 			_id: "user-id",
		// 			name: "user-name",
		// 		},
		// 	},
		// };

		// axios.post.mockResolvedValue(mockResponse);

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
		await userEvent.click(loginButton);

		await waitFor(() => {
			expect(axiosInstance.post).toHaveBeenCalledWith("/users/login", {
				email: "u1@market.com",
				password: "11111111",
			});
			expect(toast.success).toHaveBeenCalledWith(
				"로그인 성공!",
				expect.anything(),
			);
		});
	});

	it("로그인 실패 시 적절한 오류 메시지를 출력해야 합니다", async () => {
		// axiosInstance.post.mockRejectedValue({
		// 	response: {
		// 		status: 401,
		// 		data: { message: "로그인 실패" },
		// 	},
		// });

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
			expect(toast.error).toHaveBeenCalledWith("로그인 실패");
		});
	});
});
