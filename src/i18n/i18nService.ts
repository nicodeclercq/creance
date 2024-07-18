import {
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
} from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import { Language } from "../entities/languages";

const translationsByLanguage = new BehaviorSubject<{
  [language: string]: { [key: string]: string };
}>({});

const setTranslationsByLanguage = (
  lang: string,
  translations: { [key: string]: string }
) => {
  translationsByLanguage.next({
    ...translationsByLanguage.value,
    [lang]: translations,
  });
  return translations;
};

const getTranslationsByLanguage = (lang: string) => {
  return translationsByLanguage.value[lang];
};
const hasLang = (lang: string) => {
  return !!translationsByLanguage.value[lang];
};

const retrieveTranslations = (
  lang: string
): Promise<{ [key: string]: string }> =>
  hasLang(lang)
    ? Promise.resolve(getTranslationsByLanguage(lang))
    : Promise.resolve()
        .then(() => fetch(`/i18n/${lang}/index.json`))
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Can't retrieve translations for ${lang}`);
          }
        })
        .catch(() => {
          if (lang && lang.includes("-")) {
            const globalLang = lang.split("-")[0];
            return retrieveTranslations(globalLang).then((response) =>
              setTranslationsByLanguage(globalLang, response)
            );
          }
        })
        .then((response) => setTranslationsByLanguage(lang, response));

const currentLanguage = navigator.language as Language;

export const I18nService = {
  changeLang: retrieveTranslations,
  getCurrentLanguage: () => currentLanguage,
  setTranslations: setTranslationsByLanguage,
  getTranslations: (language: Language) =>
    translationsByLanguage.asObservable().pipe(
      map((t) => t[language]),
      filter((t) => !!t),
      distinctUntilChanged(),
      debounceTime(1000)
    ),
};
