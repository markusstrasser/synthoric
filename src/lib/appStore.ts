import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mutative } from "zustand-mutative";
import type { UserAction } from "@/lib/tsStructs";

interface AppState {
	interactions: object[];
	currentInteraction: Record<string, any> | null;
	userActions: UserAction[];
	finalActionTriggered: boolean;
	isLoading: boolean;
	error: string | null;
	redirectedPaths: { id: string; index: string }[];
	hasBeenRedirected: boolean;
}

type AppActions = {
	addUserAction: (action: UserAction) => void;
	setError: (error: string | null) => void;
	addRedirectedPath: (id: string, index: string) => void;
	checkRedirection: (id: string, currentIndex: string) => void;
	resetExceptRedirectedPaths: () => void;
};

const initialState: AppState = {
	interactions: [],
	currentInteraction: null,
	userActions: [],
	finalActionTriggered: false,
	isLoading: false,
	error: null,
	redirectedPaths: [],
	hasBeenRedirected: false,
};

export const useStore = create<AppState & AppActions>()(
	persist(
		mutative((set) => ({
			...initialState,
			addUserAction: (action) =>
				set((state) => {
					state.userActions.push({ ...action, timeStamp: Date.now() });
					state.finalActionTriggered = action.isFinal ?? false;
				}),
			setError: (error) => set({ error }),
			addRedirectedPath: (id, index) =>
				set((state) => {
					state.redirectedPaths.push({ id, index });
					state.hasBeenRedirected = true;
				}),

			checkRedirection: (id, currentIndex) =>
				set((state) => {
					state.hasBeenRedirected = state.redirectedPaths.some(
						(path) => path.id === id && path.index === currentIndex,
					);
				}),
			resetExceptRedirectedPaths: () => {
				set((state) => ({
					...initialState,
					redirectedPaths: state.redirectedPaths,
				}));
			},
		})),
		{
			name: "redirected-paths",
			partialize: (state) => ({ redirectedPaths: state.redirectedPaths }),
		},
	),
);
