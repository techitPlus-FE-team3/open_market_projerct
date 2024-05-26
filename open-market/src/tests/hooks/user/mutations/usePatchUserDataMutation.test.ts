import { patchUserData } from "@/apis/user/patch";
import { usePatchUserDataMutation } from "@/hooks/user/mutations/usePatchUserMutation";
import TestWrapper from "@/tests/Wrapper";
import { useQueryClient } from "@tanstack/react-query";
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

const invalidateQueriesMock = vi.fn();
vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query");
	return {
		...actual,
		useQueryClient: vi.fn(() => ({
			invalidateQueries: invalidateQueriesMock,
		})),
	};
});

vi.mock("@/apis/user/patch", async () => {
	const actual = await vi.importActual("@/apis/user/patch");
	return {
		...actual,
		patchUserData: vi.fn(),
	};
});

const mockPatchUserData = patchUserData as unknown as MockInstance;

describe("usePatchUserDataMutation", () => {
	const navigate = vi.fn();
	let queryClient: ReturnType<typeof useQueryClient>;
	let result: {
		current: ReturnType<typeof usePatchUserDataMutation>;
	};

	beforeEach(() => {
		vi.clearAllMocks();

		(useNavigate as unknown as MockInstance).mockImplementation(() => navigate);
		queryClient = useQueryClient();

		result = renderHook(() => usePatchUserDataMutation(), {
			wrapper: TestWrapper,
		}).result;
	});

	it("회원 정보 수정 성공 시 성공 메시지를 표시하고 마이페이지로 이동한다.", async () => {
		const mockResponse = {
			ok: 1,
		};

		mockPatchUserData.mockResolvedValueOnce(mockResponse);
		const toastSuccessSpy = vi.spyOn(toast, "success");

		await act(async () => {
			result.current.mutate({
				userId: 1,
				userData: {
					name: "Updated User",
					email: "updated@example.com",
					phone: "010-1234-5678",
					extra: {
						profileImage: "",
						terms: {
							recievingMarketingInformation: false,
							confirmAge: false,
						},
					},
				},
			});
		});

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith(
				"회원 정보가 수정되었습니다.",
				{
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				},
			);
			expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
				queryKey: ["userData"],
			});
			expect(navigate).toHaveBeenCalledWith("/mypage");
		});
	});

	it("회원 정보 수정 실패 시 오류 메시지를 표시한다.", async () => {
		const mockError = {
			response: {
				data: {
					message: "Update failed",
				},
			},
		};

		mockPatchUserData.mockRejectedValueOnce(mockError);
		const toastErrorSpy = vi.spyOn(toast, "error");

		await act(async () => {
			result.current.mutate({
				userId: 1,
				userData: {
					name: "Updated User",
					email: "updated@example.com",
					phone: "010-1234-5678",
					extra: {
						profileImage: "",
						terms: {
							recievingMarketingInformation: false,
							confirmAge: false,
						},
					},
				},
			});
		});

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith(
				"회원 정보 수정에 실패했습니다.",
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
