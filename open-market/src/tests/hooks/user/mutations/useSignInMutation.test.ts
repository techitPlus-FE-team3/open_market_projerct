import { signIn } from "@/apis/user/auth";
import { useSignInMutation } from "@/hooks/user/mutations/useSignInMutation";
import TestWrapper from "@/tests/Wrapper";
import { act, renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { MockInstance, beforeEach, describe, expect, it, vi } from "vitest";

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

describe("useSignInMutation", () => {
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

		vi.spyOn(window.localStorage, "setItem");
	});

	afterEach(() => {
		vi.clearAllMocks();
		window.localStorage.clear();
	});

	it("로그인 성공시 localStorage에 값을 저장하고 로그인 성공 알림과 함께 메인 페이지로 이동한다.", async () => {
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

		const { result } = renderHook(() => useSignInMutation(), {
			wrapper: TestWrapper,
		});

		await act(async () => {
			result.current.mutate({
				email: "test@test.com",
				password: "password",
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
			expect(toastSuccessSpy).toHaveBeenCalledWith("로그인 성공!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			expect(setCurrentUser).toHaveBeenCalledWith({
				_id: "userId",
				name: "userName",
				profileImage: "profileImageUrl",
			});
			expect(navigate).toHaveBeenCalledWith("/");
		});
	});

	it("로그인 실패시 토스트 알림을 호출한다.", async () => {
		const mockError = {
			response: {
				data: {
					message: "Invalid credentials",
				},
			},
		};

		mockSignIn.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		const { result } = renderHook(() => useSignInMutation(), {
			wrapper: TestWrapper,
		});

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "wrongpassword",
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("Invalid credentials", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		});
	});

	it("알 수 없는 오류 발생 시 토스트 알림을 호출한다.", async () => {
		const mockError = {};

		mockSignIn.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		const { result } = renderHook(() => useSignInMutation(), {
			wrapper: TestWrapper,
		});

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "password123",
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(
				"알 수 없는 오류가 발생했습니다.",
				{
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				},
			);
		});
	});
});
