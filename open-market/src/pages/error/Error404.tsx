import { Common } from "@/styles/common";
import styled from "@emotion/styled";

const ErrorContainer = styled.div`
	height: 100vh;
	padding: 100px;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	gap: ${Common.space.spacingLg};
	background-color: ${Common.colors.gray2};
	img {
		width: 400px;
		height: auto;
	}
`;

function Error404() {
	return (
		<ErrorContainer>
			<img src="/404.png" alt="404 에러 이미지" />
			<h1>404 Error</h1>
			<p>존재하지 않는 페이지입니다.</p>
		</ErrorContainer>
	);
}

export default Error404;
