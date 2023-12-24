export function setItemWithExpireTime(
	key: string,
	value: Product[] | string,
	tts: number,
): void {
	const obj = {
		value,
		expire: Date.now() + tts,
	};

	const objString = JSON.stringify(obj);

	localStorage.setItem(key, objString);
}

export function getItemWithExpireTime(key: string) {
	const objString = localStorage.getItem(key);
	if (!objString) return null;

	const obj = JSON.parse(objString);

	if (Date.now() > obj.expire) {
		localStorage.removeItem(key);
		return null;
	}

	return obj.value;
}
