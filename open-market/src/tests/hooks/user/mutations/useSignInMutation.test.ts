import { renderHook, act, waitFor } from "@testing-library/react";
import { useSignInMutation } from "@/hooks/user/queries/useSignInMutation";
import { signIn } from "@/apis/user/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { vi, describe, it, expect, beforeEach, MockInstance } from "vitest";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

vi.mock("@/apis/user/auth", async () => {
	const actual = await vi.importActual("@/apis/user/auth");
	return {
		...actual,
		signIn: vi.fn(),
	};
});

vi.mock("recoil", async () => {
	const actual = await vi.importActual("recoil");
	return {
		...actual,
		useSetRecoilState: vi.fn(),
	};
});

const mockSignIn = signIn as unknown as MockInstance;

describe("useSignInMutation 훅 테스트", () => {
	const navigate = vi.fn();
	const setCurrentUser = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		(useNavigate as unknown as MockInstance).mockImplementation(() => navigate);
		(useSetRecoilState as unknown as MockInstance).mockImplementation(
			() => setCurrentUser,
		);

		const localStorageMock = (function () {
			let store: Record<string, string> = {};
			return {
				getItem(key: string) {
					return store[key] || null;
				},
				setItem(key: string, value: string) {
					store[key] = value;
				},
				clear() {
					store = {};
				},
				removeItem(key: string) {
					delete store[key];
				},
			};
		})();

		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("성공적인 로그인", async () => {
		const mockResponse = {
			ok: 1,
			item: {
				_id: "userId",
				name: "userName",
				extra: { profileImage: "profileImageUrl" },
				token: { accessToken: "accessToken", refreshToken: "refreshToken" },
			},
		};

		mockSignIn.mockResolvedValueOnce(mockResponse);
		const toastSuccessSpy = vi.spyOn(toast, "success");

		const { result } = renderHook(() => useSignInMutation());

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "password123",
			});
		});

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				"accessToken",
				"accessToken",
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				"refreshToken",
				"refreshToken",
			);
			expect(toastSuccessSpy).toHaveBeenCalledWith("로그인 성공!");
			expect(setCurrentUser).toHaveBeenCalledWith({
				_id: "userId",
				name: "userName",
				profileImage: "profileImageUrl",
			});
			expect(navigate).toHaveBeenCalledWith("/");
		});
	});

	it("로그인 실패", async () => {
		const mockError = {
			response: {
				data: {
					message: "Invalid credentials",
				},
			},
		};

		mockSignIn.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		const { result } = renderHook(() => useSignInMutation());

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "wrongpassword",
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("Invalid credentials");
		});
	});

	it("알 수 없는 오류 발생 시", async () => {
		const mockError = {};

		mockSignIn.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		const { result } = renderHook(() => useSignInMutation());

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "password123",
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(
				"알 수 없는 오류가 발생했습니다.",
			);
		});
	});
});
