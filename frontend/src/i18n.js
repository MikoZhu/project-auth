import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Import your separate JSON translation files
import enTranslations from "./translation/english.json";
import seTranslations from "./translation/swedish.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  se: {
    translation: seTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
