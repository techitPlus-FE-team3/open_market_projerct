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

const Input = styled.input`
	// 스타일
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
		<>
			{label && <label htmlFor={id}>{label}</label>}
			<Input
				type={type}
				id={id}
				name={name}
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
			/>
		</>
	);
}

export default AuthInput;
