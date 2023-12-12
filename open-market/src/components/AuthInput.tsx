import { Common } from "@/styles/common";
import styled from "@emotion/styled";

// Props 인터페이스 정의
interface AuthInputProps {
	id: string;
	name: string;
	label?: string;
	type: string;
	defaultValue: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
}

const AuthInputWrppaer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const Label = styled.label`
	${Common.a11yHidden};
`;

const Input = styled.input`
	// 스타일
	box-sizing: border-box;

	width: 383px;
	height: 55px;
	font-size: 18px;
	font-weight: 500;
	padding: 0 20px;
	background: ${Common.colors.gray2};
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;
	&::placeholder {
		color: ${Common.colors.black};
		font-size: 18px;
		font-weight: 500;
	}
	&:focus {
		outline: 0;
	}
`;

function AuthInput(props: AuthInputProps) {
	const {
		id,
		name,
		label,
		type,
		defaultValue,
		onChange,
		placeholder,
		required,
	} = props;
	return (
		<AuthInputWrppaer>
			{label && <Label htmlFor={id}>{label}</Label>}
			<Input
				type={type}
				id={id}
				name={name}
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
			/>
		</AuthInputWrppaer>
	);
}

export default AuthInput;
