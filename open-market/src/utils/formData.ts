export function formatDate(inputDateStr: string) {
	const inputDate = new Date(inputDateStr);

	const year = inputDate.getFullYear();
	const month = String(inputDate.getMonth() + 1).padStart(2, "0");
	const day = String(inputDate.getDate()).padStart(2, "0");

	return `${year}년 ${month}월 ${day}일`;
}
