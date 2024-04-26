import Header from "@/layout/Header";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { beforeEach, describe, expect, it, vi } from "vitest";

// react-hot-toast 모킹
vi.mock("react-hot-toast");

// react-router-dom 모킹
vi.mock("react-router-dom", async () => {
	const actual = await import("react-router-dom");
	return {
		...actual,
		useNavigate: () => () => {}, // Simplified mock for useNavigate
	};
});

describe("Header 컴포넌트의 로그아웃 기능 테스트", () => {
	beforeEach(() => {
		// 모든 모의를 초기화하고 환경을 설정
		vi.resetAllMocks();

		// Mock localStorage
		Storage.prototype.removeItem = vi.fn();
		Storage.prototype.clear = vi.fn();
	});

	it("로그아웃 버튼 클릭 시 로그아웃 처리가 수행되어야 함", async () => {
		render(
			<RecoilRoot>
				<BrowserRouter>
					<Header />
				</BrowserRouter>
			</RecoilRoot>,
		);

		// const logoutButton = screen.getByLabelText("로그아웃");
		await act(async () => {
			const logoutButton = await screen.findByTestId("logout-button");
			await userEvent.click(logoutButton);
		});

		expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
		expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
		expect(localStorage.clear).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith(
			"로그아웃 되었습니다.",
			expect.anything(),
		);
	});
});
