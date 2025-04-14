// import { LanguageObj, Link } from "./../types";
import { StateCreator } from "zustand";
import { LanguageObj, Link } from "../types";
// import {
//     AdType,
//     Language,
//     LevelI,
//     NewsI,
//     UpgradeBanner,
//     WordsCategory,
// } from "../types";
import * as Localization from "expo-localization";
import { LANGUAGES, LINKS } from "../constants";
// import { LANGUAGES } from "../constants";


export interface GeneralSlice {
    showLoader: { visible: boolean; text?: string };
    languages: LanguageObj[];
    language: string;
    isFirstLaunch: boolean;
    isLoggedin: boolean;
    links: Link[];

    // actions
    setShowLoader: (value: boolean, text?: string) => void;
    setLanguages: (value: LanguageObj[]) => void;
    setIsFirstLaunch: (value: boolean) => void;
    setIsLoggedin: (value: boolean) => void;
    setLinks: (value: Link[]) => void;
}

const deviceLang = Localization.getLocales()[0]?.languageCode || "";

const defaultState = {
    isLoggedin: false,
    showLoader: { visible: false },
    isFirstLaunch: true,
    languages: LANGUAGES,
    // language: 'en',
    language: LANGUAGES.map(data => data.code).includes(deviceLang) ? deviceLang : "en",
    links: LINKS,
};

const createGeneralSlice: StateCreator<GeneralSlice, [], [], GeneralSlice> = (
    set
) => ({
    ...defaultState,
    setShowLoader: (value: boolean, text?: string) =>
        set(() => ({ showLoader: { visible: value, text: text || "" } })),
    setIsFirstLaunch: (value: boolean) => set(() => ({ isFirstLaunch: value })),
    setLanguages: (value: LanguageObj[]) => set(() => ({ languages: value })),
    setLinks: (value: Link[]) => set(() => ({ links: value })),
    setIsLoggedin: (value: boolean) => set(() => ({ isLoggedin: value })),
    setLanguage: (value: string) => set(() => ({ language: value })),
});

export default createGeneralSlice;
