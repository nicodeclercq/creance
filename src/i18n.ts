import fr from "./i18n/fr.json";
import i18next from "i18next";
import icu from "i18next-icu";
import { initReactI18next } from "react-i18next";

export type Translation = keyof typeof fr;

i18next
  .use(icu)
  .use(initReactI18next)
  .init({
    lng: "fr",
    debug: true,
    fallbackLng: "fr",
    resources: {
      fr: {
        translation: fr,
      },
    },
  });

export const i18n = i18next;
