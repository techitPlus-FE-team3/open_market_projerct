interface SelectGenreProps {
	id: string;
	value?: string | undefined;
	handleFn: React.ChangeEventHandler<HTMLSelectElement>;
	category: CategoryCode[] | undefined;
}
function SelectGenre({ id, value, handleFn, category }: SelectGenreProps) {
	return (
		<>
			{category && value && (
				<div>
					<label htmlFor={id}>장르</label>
					<select name={id} id={id} defaultValue={value} onChange={handleFn}>
						<option value="none" disabled hidden>
							장르를 선택해주세요
						</option>
						{category.length > 0 ? (
							category.map((item) => (
								<option key={item.code} value={item.code}>
									{item.value}
								</option>
							))
						) : (
							<option disabled>아직 카테고리가 없습니다.</option>
						)}
					</select>
				</div>
			)}
		</>
	);
}
export default SelectGenre;
