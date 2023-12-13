import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface TextareaProps {
	readOnly?: boolean;
	content?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaWrapper = styled.div<{ width: string }>`
	width: ${({ width }) => width};
	height: 166px;
	display: flex;
	white-space: nowrap;
`;

const TextareaLabel = styled.label`
	color: ${Common.colors.gray};
	padding: ${Common.space.spacingMd};
`;

const TextareaBox = styled.textarea<{ width: string }>`
	width: ${({ width }) => width || "650px"};
	height: 160px;
	border: none;
	resize: none;
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
