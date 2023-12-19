import styled from "@emotion/styled";

interface SpinnerProps {
	width: string;
	height: string;
}

const Spinner = styled.div<SpinnerProps>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	img {
		width: 50%;
	}
`;

function UploadLoadingSpinner({ width, height }: SpinnerProps) {
	return (
		<Spinner width={width} height={height}>
			<img src="/loadingSpinner.svg" alt="업로드 중" />
		</Spinner>
	);
}

export default UploadLoadingSpinner;
