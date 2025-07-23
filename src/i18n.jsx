import i18n from "i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from "i18next-browser-languagedetector";

import translationEng from "./locales/en/translation.json";
import translationFre from "./locales/fr/translation.json";
import translationGer from "./locales/de/translation.json";
i18n.use(HttpApi).use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: translationEng
    },
    fr: {
      translations: translationFre
    },
    de: {
      translations: translationGer
    }
  },
  fallbackLng: "en",
  debug: false,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true,
    useSuspense: false
  }
});

export default i18n;