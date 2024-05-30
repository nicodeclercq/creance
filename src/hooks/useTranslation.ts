import { Language } from './../entities/languages';
import { I18nService } from './../i18n/i18nService';
import { I18nContext } from './../i18nProvider';
import { useContext, useEffect } from 'react';

export function useTranslations(lang?: Language) {
  const {language, setLanguage, translations, setTranslations} = useContext(I18nContext);

  if(lang){
    setLanguage(lang);
  }

  useEffect(() => {
    const subscription = I18nService.getTranslations(lang || language)
      .subscribe((value) => {
        setTranslations(value);
      });

    return subscription.unsubscribe.bind(subscription);
  }, [language, lang, setTranslations]);

  return translations;
}