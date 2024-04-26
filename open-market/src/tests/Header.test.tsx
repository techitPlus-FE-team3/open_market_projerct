import Header from "@/layout/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, render, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

const queryClient = new QueryClient();

// API 모킹
// const server = setupServer(
// 	http.post("/users/login", async ({ request }) => {
// 		const newPost = await request.json();
// 		return HttpResponse.json(newPost, { status: 201 });
// 	}),
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

describe("Header 컴포넌트", () => {
	it("로그인 상태에서 사용자 인터페이스를 테스트", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<Header />
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 요소 검증
		await waitFor(() =>
			expect(screen.getByTestId("logout-button")).toBeInTheDocument(),
		);
	});

	it("로그아웃 상태에서 사용자 인터페이스를 테스트", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<Header />
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 로그인/회원가입 버튼 확인
		await waitFor(() =>
			expect(screen.getByText("로그인 / 회원가입")).toBeInTheDocument(),
		);
	});
});
