import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "currentUser",
	storage: localStorage,
});

export const currentUserState = atom<CurrentUser | null>({
	key: "currentUserState",
	default: null,
	effects: [persistAtom],
});
