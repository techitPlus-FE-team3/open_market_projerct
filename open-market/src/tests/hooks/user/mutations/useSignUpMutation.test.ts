import { signUp } from "@/apis/user/auth";
import { useSignUpMutation } from "@/hooks/user/mutations/useSignUpMutation";
import TestWrapper from "@/tests/Wrapper";
import { UseMutationResult } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
		signUp: vi.fn(),
	};
});

const mockSignUp = signUp as unknown as MockInstance;

describe("useSignUpMutation", () => {
	const navigate = vi.fn();
	let result: {
		current: UseMutationResult<any, any, any, unknown>;
	};
	beforeEach(() => {
		vi.clearAllMocks();

		(useNavigate as unknown as MockInstance).mockImplementation(() => navigate);

		result = renderHook(() => useSignUpMutation(), {
			wrapper: TestWrapper,
		}).result;
	});

	it("회원가입 성공시 성공 알림을 표시하고 로그인 페이지로 이동한다.", async () => {
		const mockResponse = {
			ok: 1,
		};

		mockSignUp.mockResolvedValueOnce(mockResponse);
		const toastSuccessSpy = vi.spyOn(toast, "success");

		await act(async () => {
			result.current.mutate({
				email: "test@test.com",
				password: "password",
				name: "Test User",
				phone: "010-1234-5678",
				type: "seller",
			});
		});

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("회원가입 완료!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			expect(navigate).toHaveBeenCalledWith("/signin");
		});
	});

	it("회원가입 실패시 토스트 알림을 호출한다.", async () => {
		const mockError = {
			response: {
				data: {
					message: "Invalid credentials",
				},
			},
		};

		mockSignUp.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "wrongpassword",
				name: "Test User",
				phone: "010-1234-5678",
				type: "seller",
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

		mockSignUp.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		await act(async () => {
			result.current.mutate({
				email: "test@example.com",
				password: "wrongpassword",
				name: "Test User",
				phone: "010-1234-5678",
				type: "seller",
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(
				"회원가입 중 알 수 없는 오류가 발생했습니다.",
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
