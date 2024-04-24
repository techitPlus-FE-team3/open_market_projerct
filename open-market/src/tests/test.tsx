type InputProps = {
	label: string;
	name: string;
} & React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

export function Input({ label, name, ...props }: InputProps) {
	return (
		<>
			<label htmlFor={name}>{label}</label>
			<input name={name} id={name} {...props} />
		</>
	);
}
