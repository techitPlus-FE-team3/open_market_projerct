import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface StyleProps {
	type?: string;
}
const FormInputWrapper = styled.div<StyleProps>`
	display: flex;
	align-items: center;
	border: 1px solid black;
	border-radius: 10px;
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	height: 72px;

	${(props) =>
		props.type === "number" &&
		`
    align-items: start;
    justify-content: space-between;
    height: 290px;
    position: relative;
	`}
`;
const InputLabel = styled.label<StyleProps>`
	color: ${Common.colors.gray};
	white-space: nowrap;
	&:after {
		content: " | ";
	}

	${(props) =>
		props.type === "number" &&
		`
    &:after {
  content: "";
}
	`}
`;

const Input = styled.input`
	border: 0px;
	outline: none;
	width: 350px;
	font-size: 16px;
	color: ${Common.colors.black};
	height: 50px;
	&::-webkit-inner-spin-button {
		appearance: none;
		-moz-appearance: none;
		-webkit-appearance: none;
	}

	${(props) =>
		props.type === "number" &&
		`
    position: absolute; 
	  right: 0; 
	  bottom: 0; 
    width:700px;
    font-size: ${Common.font.size.xl};
    height:270px;
    text-align: end;
    padding-top: 200px;
    margin-bottom:10px;
	`}
`;

function FormInput({
	name,
	label,
	type = "text",
	defaultValue,
	placeholder = "",
	handleFn,
}: {
	name: string;
	label: string;
	type?: string;
	defaultValue?: string | number | undefined | string[];
	placeholder?: string;
	handleFn: React.ChangeEventHandler<HTMLInputElement>;
}) {
	return (
		<FormInputWrapper type={type}>
			<InputLabel htmlFor={name} type={type}>
				{label}
			</InputLabel>
			<Input
				type={type}
				name={name}
				defaultValue={defaultValue}
				onChange={handleFn}
				id={name}
				placeholder={placeholder}
			/>
		</FormInputWrapper>
	);
}

export default FormInput;
