import { Input } from "./test";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("test", async () => {
	it("test Input 렌더링", () => {
		render(
			<Input
				name="email"
				type="email"
				placeholder="Email"
				label="Email address"
			/>,
		);

		expect(screen.getByText("Email address")).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", {
				name: /email address/i,
			}),
		).toBeInTheDocument();
	});

	it("input 값 변경 테스트", async () => {
		render(
			<Input
				name="email"
				type="email"
				placeholder="Email"
				label="Email address"
			/>,
		);
		const input = screen.getByRole("textbox", {
			name: /email address/i,
		});
		await userEvent.type(input, "1234");
		expect(input).toHaveValue("1234");
	});
});

describe("change", async () => {
	it("input 값 변경 테스트", async () => {
		render(
			<Input
				name="email"
				type="email"
				placeholder="Email"
				label="Email address"
			/>,
		);
		const input = screen.getByRole("textbox", {
			name: /email address/i,
		});
		await userEvent.type(input, "1234");
		expect(input).toHaveValue("1234");
	});
});
