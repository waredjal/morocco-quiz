import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import fr from "./translations/fr.json";
import es from "./translations/es.json";
import it from "./translations/it.json";
import de from "./translations/de.json";

import useAppState from "./utils/state/useStore";

const language = useAppState.getState().language;

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  de: { translation: de },
};

i18n.use(initReactI18next).init({
  lng: language,
  resources,
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
