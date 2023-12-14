import { Common } from "@/styles/common";
import styled from "@emotion/styled";

const FilterItem = styled("div")`
	display: none;
	width: 140px;
	height: 34px;
	padding: 1px 10px 0px 20px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	position: relative;
	font-weight: ${Common.font.weight.regular};
	border: 1px solid ${Common.colors.gray};
	border-radius: calc(100vh / 2);
	background-color: ${Common.colors.white};

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		transform: translateY(-25%);
		right: 12px;
		border-bottom: solid 12px transparent;
		border-top: solid 12px black;
		border-left: solid 12px transparent;
		border-right: solid 12px transparent;
	}
`;

export const FilterButton = FilterItem.withComponent("button");

export const FilterSelect = styled(FilterItem)`
	select {
		appearance: none;
		width: 100%;
		height: 100%;
		font-weight: ${Common.font.weight.regular};
		background-color: transparent;
		border: none;
		z-index: 10;
		cursor: pointer;
	}
`;
