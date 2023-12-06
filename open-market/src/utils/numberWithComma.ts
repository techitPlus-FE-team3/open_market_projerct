export function numberWithComma(n: number) {
	return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
