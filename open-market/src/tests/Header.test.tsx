import Header from "@/layout/Header";
import { currentUserState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
	http.get("/products", () => {
		return HttpResponse.json({
			_id: "1",
			name: "test",
		});
	}),
);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false, // 테스트 중에는 재시도를 비활성화
			initialData: [], // 기본 데이터로 빈 배열 제공
		},
	},
});

// 컴포넌트 마운트 상태 확인을 위한 훅
const useIsMounted = () => {
	const isMounted = useRef(false);
	useEffect(() => {
		console.log("Component mounted");
		isMounted.current = true;
		return () => {
			console.log("Component will unmount");
			isMounted.current = false;
		};
	}, []);
	return isMounted;
};

// Function to safely update user state
const updateUserState = (user, setUser, isMounted) => {
	if (isMounted.current) {
		setUser(user);
		console.log("User set", user);
	} else {
		console.log("Attempt to set state after unmount");
	}
};

// 로그인 상태를 모의하기 위한 컴포넌트
const MockLoginState = ({ children, user }) => {
	const setUser = useSetRecoilState(currentUserState);
	const isMounted = useIsMounted();

	useEffect(() => {
		console.log("Setting user", user);
		updateUserState(user, setUser, isMounted);
	}, [setUser, user, isMounted]);

	return <>{children}</>;
};

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	queryClient.clear(); // QueryClient의 캐시를 정리
	cleanup();
});
afterAll(() => server.close());

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
		await waitFor(() => {
			expect(screen.getByTestId("logout-button")).toBeInTheDocument();
			expect(screen.getByTestId("mypage-button")).toBeInTheDocument();
		});
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
