import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const ErrorContainer = styled.div`
	height: 100vh;
	padding: 100px;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	gap: ${Common.space.spacingLg};
	color: ${Common.colors.black};
	background-color: ${Common.colors.white};
	img {
		width: 400px;
		height: auto;
	}

	button {
		color: inherit;
		border: none;
		font-size: ${Common.font.size.lg};
		background-color: ${Common.colors.emphasize};
	}
`;

function Error404() {
	const navigate = useNavigate();

	function handleClick() {
		return navigate("/", { replace: true });
	}

	return (
		<ErrorContainer>
			<img src="/404.png" alt="404 에러 이미지" />
			<h1>404 Error</h1>
			<p>존재하지 않는 페이지입니다.</p>
			<button type="button" onClick={handleClick}>
				메인페이지로 돌아가기
			</button>
		</ErrorContainer>
	);
}

export default Error404;
