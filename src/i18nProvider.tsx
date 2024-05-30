import { ReactNode, createContext, useEffect, useState } from "react";
import { Language } from "./entities/languages";
import { I18nService } from "./i18n/i18nService";
import defaultLanguage from "./i18n/fr/index.json";
import { Translation } from "./@types/translations";

const DEFAULT_LANG = "FR-fr";

const context = {
  language: I18nService.getCurrentLanguage(),
  setLanguage: (newLanguage: Language) => {
    I18nService.changeLang(newLanguage);
  },
  translations: null,
  setTranslations: (_prevState: any) => {},
};

export const I18nContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<Translation, string>;
  setTranslations: (_prevState: any) => void;
}>(context);

type Props = {
  children: ReactNode;
};
export function I18nProvider({ children }: Props) {
  const [translations, setTranslations] =
    useState<Record<Translation, string>>();

  useEffect(() => {
    const newTranslations = I18nService.setTranslations(
      DEFAULT_LANG,
      defaultLanguage
    );
    setTranslations(newTranslations);
  }, []);

  return (
    <I18nContext.Provider value={{ ...context, translations, setTranslations }}>
      {children}
    </I18nContext.Provider>
  );
}
