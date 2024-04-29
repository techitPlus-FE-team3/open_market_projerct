import Header from "@/layout/Header";
import { currentUserState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { ReactNode, useEffect, useRef, FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
interface MockLoginStateProps {
	children: ReactNode;
	user: User | null;
}

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

// User 객체를 CurrentUser 객체로 변환하는 화살표 함수
const toCurrentUser = (user: User | null): CurrentUser | null => {
	if (!user) return null;
	return {
		_id: user._id,
		name: user.name,
		profileImage: user.extra?.profileImage || null,
	};
};

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
const updateUserState = (
	user: User | null,
	setUser: (user: CurrentUser | null) => void,
	isMounted: React.MutableRefObject<boolean>,
) => {
	if (isMounted.current) {
		const currentUser = toCurrentUser(user);
		setUser(currentUser);
		console.log("User set", user);
	} else {
		console.log("Attempt to set state after unmount");
	}
};

// 로그인 상태를 모의하기 위한 컴포넌트
const MockLoginState: FunctionComponent<MockLoginStateProps> = ({
	children,
	user,
}) => {
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
		// User 인터페이스에 따라 필요한 모든 속성을 포함하는 객체
		const user: User = {
			_id: 1,
			email: "test@example.com",
			password: "password123",
			name: "Test User",
			phone: "123-456-7890",
			type: "normal",
			createdAt: "2021-01-01T00:00:00.000Z",
			updatedAt: "2021-01-01T00:00:00.000Z",
			extra: {
				profileImage: "path/to/image.jpg",
				terms: {
					termsOfUse: true,
					providingPersonalInformation: true,
					recievingMarketingInformation: true,
					confirmAge: true,
				},
			},
			token: {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			},
		};

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
