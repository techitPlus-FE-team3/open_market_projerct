import Header from "@/layout/Header";
import { currentUserState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { describe, expect, it, vi } from "vitest";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false, // 테스트 중에는 재시도를 비활성화
			initialData: [], // 기본 데이터로 빈 배열 제공
		},
	},
});
// 로그인 상태를 모의하기 위한 컴포넌트
const MockLoginState = ({ children, user }) => {
	const setUser = useSetRecoilState(currentUserState);

	useEffect(() => {
		setUser(user);
	}, [setUser, user]);

	return <>{children}</>;
};

vi.mock("axios", () => {
	const axiosMock = {
		get: vi.fn().mockResolvedValue({ data: "mock data" }),
		create: vi.fn(() => axiosMock),
		defaults: { headers: { common: {} } },
		interceptors: {
			request: { use: vi.fn(), eject: vi.fn() },
			response: { use: vi.fn(), eject: vi.fn() },
		},
	};
	return {
		default: axiosMock,
		__esModule: true, // ES 모듈 호환성 보장
	};
});

describe("Header 컴포넌트", () => {
	it("로그인 상태에서 사용자 인터페이스를 테스트", async () => {
		const user = { id: 1, name: "Test User" }; // 로그인 상태를 나타내는 객체

		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<MockLoginState user={user}>
							<Header />
						</MockLoginState>
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 요소 검증
		await waitFor(() =>
			expect(screen.getByTestId("logout-button")).toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(screen.getByTestId("mypage-button")).toBeInTheDocument(),
		);
	});

	it("로그아웃 상태에서 사용자 인터페이스를 테스트", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<MockLoginState user={null}>
							<Header />
						</MockLoginState>
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
