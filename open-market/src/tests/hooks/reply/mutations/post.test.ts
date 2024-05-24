import { postProductReply } from "@/apis/product/replies";
import { usePostReplyMutation } from "@/hooks/reply/mutations/usePostReplyMutation";
import TestWrapper from "@/tests/Wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { MockInstance, vi } from "vitest";

vi.mock("@/apis/product/replies", () => ({
	...vi.importActual("@/apis/product/replies"),
	postProductReply: vi.fn(),
}));

const mockPostProductReply = postProductReply as unknown as MockInstance;

describe("usePostReplyMutation", () => {
	const mockReplyContent = "정말 좋네요!";
	const mockReply = {
		order_id: 0,
		product_id: 45,
		rating: 5,
		content: mockReplyContent,
		extra: {
			profileImage: "",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("댓글 작성이 성공하면, 성공했다는 toast가 보여진다.", async () => {
		mockPostProductReply.mockResolvedValueOnce(mockReply);
		const toastSuccessSpy = vi.spyOn(toast, "success");

		const { result } = renderHook(() => usePostReplyMutation(), {
			wrapper: TestWrapper,
		});

		await waitFor(async () => {
			result.current.mutate(mockReply);
		});

		expect(toastSuccessSpy).toHaveBeenCalledWith(
			"댓글을 작성했습니다.",
			expect.anything(),
		);
	});

	it("댓글 작성이 실패하면, 에러를 console.error()로 확인할 수 있다", async () => {
		mockPostProductReply.mockRejectedValueOnce(new Error("Network Error"));

		const { result } = renderHook(() => usePostReplyMutation(), {
			wrapper: TestWrapper,
		});
		const consoleErrorSpyOn = vi.spyOn(console, "error");

		await waitFor(async () => {
			result.current.mutate(mockReply);
		});

		expect(consoleErrorSpyOn).toHaveBeenCalled();
	});
});
