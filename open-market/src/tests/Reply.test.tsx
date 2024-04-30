import ProductDetail from "@/pages/product/ProductDetail";
import {
	fireEvent,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HelmetProvider } from "react-helmet-async";

import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterEach } from "node:test";
import { RecoilRoot } from "recoil";
import { afterAll, beforeAll } from "vitest";
import toast from "react-hot-toast";
import { currentUserState } from "@/states/authState";
import { MemoryRouter } from "react-router-dom";

const server = setupServer(
	http.get("/products/:id", ({ params }) => {
		const { id } = params;
		return HttpResponse.json({
			ok: 1,
			item: {
				_id: 45,
				seller_id: 4,
				price: 3000,
				name: "50글자가넘어갔을때어떻게보일까요50글자가넘어갔을때어떻게보일까요50글자가넘어갔을때어떻게보일까",
				mainImages: [
					{
						name: "YcAxQ-Z4B.jpeg",
						originalname: "KakaoTalk_Photo_2022-12-29-14-02-19.jpeg",
						path: "https://modi-ip3-modi.koyeb.app/api/files/YcAxQ-Z4B.jpeg",
					},
				],
				content: "내이름음짱난.\n어린이탐정이죠.\n호호이",
				buyQuantity: 1,
				createdAt: "2024.04.21 11:22:36",
				extra: {
					sellerName: "제이지",
					isNew: true,
					isBest: true,
					category: "",
					tags: ["신나는"],
					soundFile: {
						duration: 36.3885625,
						name: "fM-aV_I-s.mp3",
						originalname: "sample-oppa (1).mp3",
						path: "https://modi-ip3-modi.koyeb.app/api/files/fM-aV_I-s.mp3",
					},
				},
				replies: [],
				bookmarks: [
					{
						_id: 112,
						user_id: 2,
						product_id: 45,
						memo: "",
						createdAt: "2024.04.21",
					},
				],
			},
		});
	}),
	http.get("bookmarks/products/:id", ({ params }) => {
		const { id } = params;
		return HttpResponse.json({ _id: 45, ok: 1, item: [] });
	}),
	http.post("/replies", () => {
		return HttpResponse.json({ ok: true });
	}),
);

vi.mock("react-hot-toast");

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProductDetail Component", () => {
	const currentUserMock = {
		_id: 3,
		name: "제이지",
		profileImage: "https://modi-ip3-modi.koyeb.app/api/files/OcJIrSbU6.png",
	};

	const setup = (initialState: { currentUser: CurrentUser | null }) => {
		render(
			<HelmetProvider>
				<RecoilRoot
					initializeState={({ set }) => {
						set(currentUserState, initialState.currentUser);
					}}
				>
					<MemoryRouter>
						<ProductDetail />
					</MemoryRouter>
				</RecoilRoot>
			</HelmetProvider>,
		);
	};

	it("로그인하지 않은 경우, 로그인 후 댓글을 작성할 수 있다는 메시지 표시", async () => {
		setup({ currentUser: null }); // 로그인하지 않은 상태

		if (screen.queryByTestId("product-detail-skeleton")) {
			await waitForElementToBeRemoved(() =>
				screen.queryByTestId("product-detail-skeleton"),
			);
		}

		expect(
			await screen.findByText("로그인 후 댓글을 작성할 수 있습니다."),
		).toBeInTheDocument();
	});

	describe("로그인이 되어 있는 경우", () => {
		it("상품의 판매자인 경우, 댓글 작성 불가 메시지 표시", async () => {
			setup({
				currentUser: { ...currentUserMock, _id: 4 }, // 판매자 ID로 설정
			});

			if (screen.queryByTestId("product-detail-skeleton")) {
				await waitForElementToBeRemoved(() =>
					screen.queryByTestId("product-detail-skeleton"),
				);
			}

			expect(
				await screen.findByText("내 상품에는 댓글을 작성할 수 없습니다."),
			).toBeInTheDocument();
		});

		it("상품을 구매하지 않은 경우, 구매 후 댓글 작성 가능하다는 메세지 표시", async () => {
			setup({ currentUser: currentUserMock }); // 로그인된 상태, 구매 정보 없음

			if (screen.queryByTestId("product-detail-skeleton")) {
				await waitForElementToBeRemoved(() =>
					screen.queryByTestId("product-detail-skeleton"),
				);
			}

			expect(
				await screen.findByText("음원 구매 후 댓글을 작성할 수 있습니다."),
			).toBeInTheDocument();
		});
	});

	// 	it("상품을 구매한 경우, 댓글 입력창과 버튼이 생성", async () => {
	// 		setup({ currentUser: currentUserMock }); // 상품 구매 상태로 설정 필요
	// 		const textarea = screen.getByRole("textbox", { name: /content/i });
	// 		expect(textarea).toBeInTheDocument();
	// 		const submitButton = screen.getByRole("button", { name: "작성하기" });
	// 		expect(submitButton).toBeInTheDocument();
	// 	});
	// });

	// describe("댓글 작성을 완료했을 때,", () => {
	// 	it("성공했다는 toast 메세지가 나오는가", async () => {
	// 		await waitForElementToBeRemoved(
	// 			() => screen.queryByTestId("product-detail-skeleton"),
	// 			{ timeout: 5000 },
	// 		);

	// 		const textarea = await screen.findByRole("textbox", { name: "content" });
	// 		fireEvent.change(textarea, {
	// 			target: { value: "정말 좋네요!" },
	// 		});
	// 		const submitButton = await screen.findByRole("button", {
	// 			name: "작성한 댓글 등록",
	// 		});
	// 		fireEvent.click(submitButton);

	// 		await waitFor(() => {
	// 			expect(toast.success).toHaveBeenCalledWith(
	// 				"댓글을 작성했습니다.",
	// 				expect.anything(),
	// 			);
	// 		});
	// 	});

	// 	it("댓글 입력창이 초기화되는가", async () => {
	// 		await waitForElementToBeRemoved(() =>
	// 			screen.queryByTestId("product-detail-skeleton"),
	// 		);

	// 		const textarea = await screen.findByRole<HTMLTextAreaElement>("textbox", {
	// 			name: "content",
	// 		});
	// 		fireEvent.change(textarea, { target: { value: "정말 좋네요!" } });
	// 		fireEvent.click(await screen.findByRole("button", { name: "submit" }));

	// 		await waitFor(() => {
	// 			expect(textarea.value).toBe("");
	// 		});
	// 	});
	// });

	// it("내용을 입력하지 않았을 때, toast 에러 메세지가 나오는가", async () => {
	// 	await waitForElementToBeRemoved(() =>
	// 		screen.queryByTestId("product-detail-skeleton"),
	// 	);

	// 	const submitButton = await screen.findByRole("button", {
	// 		name: "작성한 댓글 등록",
	// 	});
	// 	fireEvent.click(submitButton);
	// 	expect(await screen.findByText("내용을 입력해주세요!")).toBeInTheDocument();
	// });

	// it("댓글 업로드 중일 때, 버튼이 disabled로 바뀌는가", async () => {
	// 	await waitForElementToBeRemoved(() =>
	// 		screen.queryByTestId("product-detail-skeleton"),
	// 	);

	// 	const textarea = await screen.findByRole("textbox", { name: "content" });
	// 	fireEvent.change(textarea, { target: { value: "정말 좋네요!" } });

	// 	const submitButton = await screen.findByRole("button", {
	// 		name: "작성한 댓글 등록",
	// 	});
	// 	fireEvent.click(submitButton);

	// 	await waitFor(() => {
	// 		expect(submitButton).toBeDisabled();
	// 	});
	// });
});
