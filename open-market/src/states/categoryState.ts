import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "code",
	storage: localStorage,
});

export const codeState = atom<CategoryCode[] | null>({
	key: "codeState",
	default: null,
	effects: [persistAtom],
});
