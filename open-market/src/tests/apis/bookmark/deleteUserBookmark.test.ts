import { deleteUserBookmark } from "@/apis/user/bookmarks";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => ({
	axiosInstance: {
		delete: vi.fn(),
	},
}));

describe("deleteUserBookmark", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("successfully deletes a bookmark and returns response data", async () => {
		const mockResponse = { message: "Bookmark deleted successfully" };
		const bookmarkId = 1;

		axiosInstance.delete = vi.fn().mockResolvedValueOnce({
			data: mockResponse,
		});

		const result = await deleteUserBookmark(bookmarkId);

		expect(axiosInstance.delete).toHaveBeenCalledWith(
			`/bookmarks/${bookmarkId}`,
		);
		expect(result).toEqual(mockResponse);
	});

	it("logs error and returns undefined when an error occurs", async () => {
		const bookmarkId = 1;

		axiosInstance.delete = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network Error"));

		await expect(deleteUserBookmark(bookmarkId)).resolves.toBeUndefined();
	});
});
