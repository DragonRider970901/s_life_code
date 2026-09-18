import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHome from "./locales/en/home.json";
import roHome from "./locales/ro/home.json";
import koHome from "./locales/ko/home.json";
import jaHome from "./locales/ja/home.json";
import frHome from "./locales/fr/home.json";
import deHome from "./locales/de/home.json";


import enCommon from "./locales/en/common.json";
import roCommon from "./locales/ro/common.json";
import koCommon from "./locales/ko/common.json";
import jaCommon from "./locales/ja/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";

i18next.use(LanguageDetector).use(initReactI18next).init({
    resources: {
        en: {
            home: enHome,
            common: enCommon
        },
        ro: {
            home: roHome,
            common: roCommon
        },
        ko: {
            home: koHome,
            common: koCommon
        },
        ja: {
            home: jaHome,
            common: jaCommon
        },
        fr: {
            home: frHome,
            common: frCommon
        },
        de: {
            home: deHome,
            common: deCommon
        }
    },
    supportedLngs: ["en", "ro", "ko", "ja", "de", "fr"],
    fallbackLng: "en",
    ns: ["home", "dashboard", "auth", "common"],

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