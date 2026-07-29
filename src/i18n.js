import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHome from "./locales/en/home.json";
import roHome from "./locales/ro/home.json";
import koHome from "./locales/ko/home.json";
import jaHome from "./locales/ja/home.json";
import frHome from "./locales/fr/home.json";
import deHome from "./locales/de/home.json";

i18next.use(LanguageDetector).use(initReactI18next).init({
    resources: {
        en: {
            home: enHome,
        },
        ro: {
            home: roHome,
        },
        ko: {
            home: koHome,
        },
        ja: {
            home: jaHome,
        },
        fr: {
            home: frHome,
        },
        de: {
            home: deHome
        }
    },
    supportedLngs: ["en", "ro", "ko", "ja", "de", "fr"],
    fallbackLng: "en",
    ns: ["home", "dashboard", "auth"],

    defaultNS: "home",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
});

export default i18next;