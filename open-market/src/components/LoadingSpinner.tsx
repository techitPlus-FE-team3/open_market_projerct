import styled from "@emotion/styled";

interface SpinnerProps {
	width: string;
	height: string;
	upload?: boolean;
}

const Spinner = styled.div<SpinnerProps>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	img {
		width: ${(props) => (props.upload ? "50%" : "200px")};
	}
`;

function LoadingSpinner({ width, height, upload }: SpinnerProps) {
	return (
		<Spinner width={width} height={height} upload={upload}>
			<img src="/loadingSpinner.svg" alt="업로드 중" />
		</Spinner>
	);
}

export default LoadingSpinner;
