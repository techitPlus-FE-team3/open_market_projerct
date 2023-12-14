import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface TextareaProps {
	readOnly?: boolean;
	content?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaWrapper = styled.div<{ width: string }>`
	width: ${({ width }) => width};
	height: 116px;
	display: flex;
	white-space: nowrap;
	background-color: ${Common.colors.white};
	border-radius: 10px;
`;

const TextareaLabel = styled.label`
	color: ${Common.colors.gray};
	padding: ${Common.space.spacingMd};
`;

const TextareaBox = styled.textarea<{ width: string }>`
	width: ${({ width }) => width || "650px"};
	height: 116px;
	border: none;
	resize: none;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	&:focus {
		border: none;
		outline: none;
	}
`;

function Textarea({ readOnly = false, content = "", onChange }: TextareaProps) {
	const width = readOnly ? "918px" : "677px";

	return (
		<TextareaWrapper width={width}>
			<TextareaLabel htmlFor="description">설명</TextareaLabel>
			<TextareaBox
				name="description"
				id="description"
				width={width}
				readOnly={readOnly}
				defaultValue={content}
				onChange={onChange}
			/>
		</TextareaWrapper>
	);
}

export default Textarea;
