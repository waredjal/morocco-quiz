import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

import createGeneralSlice, { GeneralSlice } from "./generalState";
import createUserSlice, { UserSlice } from "./userStore";
import createQuizzesSlice, { QuizzesSlice } from "./quizzesState";



const storage = new MMKV();
// storage.clearAll();

const zustandStorage: StateStorage = {
    setItem: (name, value) => {
        return storage.set(name, value);
    },
    getItem: (name) => {
        const value = storage.getString(name);
        return value ?? null;
    },
    removeItem: (name) => {
        return storage.delete(name);
    },
};

export type MyState = GeneralSlice & UserSlice & QuizzesSlice & { clearState: () => void };

const useAppState = create<MyState>()(
    persist(
        (set, get, ...a) => ({
            ...createGeneralSlice(set, get, ...a),
            ...createUserSlice(set, get, ...a),
            ...createQuizzesSlice(set, get, ...a),
            clearState: () => {
                storage.clearAll(); // Clear MMKV storage
                set({
                    ...createGeneralSlice(set, get, ...a),
                    ...createUserSlice(set, get, ...a),
                    ...createQuizzesSlice(set, get, ...a),
                }); // Reset Zustand store state
            }
        }),
        {
            name: "appState", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);

export default useAppState;
