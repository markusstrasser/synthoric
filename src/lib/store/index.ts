import { writable, get } from "svelte/store";

const store = writable<{
	userActions: any[];
	finalActionTriggered: boolean;
}>({
	userActions: [],
	finalActionTriggered: false,
});

export const addUserAction = (action: any) => {
	store.update((state) => ({
		...state,
		userActions: [...state.userActions, action],
	}));
	console.log(get(store), "store");
};
export default store;
