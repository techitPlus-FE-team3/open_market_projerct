import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Rating } from "@mui/material";

interface CommentProps {
	user?: boolean;
}

export const CommentContainer = styled.article`
	width: 1160px;
	min-height: 346px;
	padding: ${Common.space.spacingMd};
	margin: ${Common.space.spacingXl} auto;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	position: relative;
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;

	h3 {
		position: absolute;
		top: -40px;
		left: 0;

		& :first-of-type {
			margin-right: 5px;
			position: relative;
			top: 6px;
			color: ${Common.colors.gray2};
		}
	}

	.moreButton {
		width: 100px;
		height: 40px;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		background-color: transparent;
		border: none;
		font-weight: ${Common.font.weight.regular};

		&::after {
			content: "";
			position: absolute;
			top: 50%;
			transform: translateY(-30%);
			right: 12px;
			border-bottom: solid 8px transparent;
			border-top: solid 8px black;
			border-left: solid 8px transparent;
			border-right: solid 8px transparent;
		}
	}
`;

const StyledCommentListItem = styled.li`
	width: 100%;
	margin: ${Common.space.spacingMd} 0;
	display: flex;
	flex-flow: column nowrap;
	position: relative;
`;

export const CommentBlock = styled.div<CommentProps>`
	width: ${(props) => (props.user ? "260px" : "100%")};
	min-height: ${(props) => (props.user ? "24px" : "40px")};
	height: auto;
	white-space: pre-wrap;
	word-break: normal;
	overflow-wrap: break-word;
	padding: ${(props) =>
		props.user ? `0 ${Common.space.spacingMd}` : `${Common.space.spacingMd}`};
	display: flex;
	flex-flow: column nowrap;
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;
	${(props) =>
		!props.user &&
		`
    line-height: ${Common.space.spacingXl};
  `};

	${(props) =>
		props.user &&
		`
    justify-content: center;
    position: absolute;
    top: 1px;
    left: ${Common.space.spacingXl};
  `};

	& :last-of-type {
		display: ${(props) => (props.user ? "relative" : "flex")};
		justify-content: ${(props) => (props.user ? "" : "flex-end")};
	}
`;

export const CommentInputForm = styled.form`
	position: relative;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.commentTextAreaContainer {
		width: 100%;
		height: 80px;
		border: 1px solid ${Common.colors.gray};
		border-radius: 10px;
	}

	.inputRating {
		position: absolute;
		top: -2px;
		left: 300px;
	}

	button {
		width: 100px;
		height: 24px;
		position: absolute;
		bottom: 5px;
		right: 5px;
		color: ${Common.colors.black};
		font-weight: ${Common.font.weight.bold};
		background-color: ${Common.colors.emphasize};
		border: none;
		border-radius: 10px;
	}
`;

export const CommentTextarea = styled(CommentBlock)`
	height: 50px;
	line-height: normal;
	word-break: normal;
	border-width: 0;
`.withComponent("textarea");

export function ShowStarRating({ rating }: { rating: number }) {
	return (
		<Rating name="showRating" value={Number(rating)} precision={0.5} readOnly />
	);
}

function CommentListItem({ reply }: { reply: Reply }) {
	return (
		<StyledCommentListItem key={reply._id}>
			<div>
				<AccountCircleIcon />
				<CommentBlock user>{reply.userName}</CommentBlock>
			</div>
			<CommentBlock>
				<span>{reply.content}</span>
				<ShowStarRating rating={reply.rating} />
			</CommentBlock>
		</StyledCommentListItem>
	);
}

export default CommentListItem;
