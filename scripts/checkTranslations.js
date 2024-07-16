const { getLanguagesList, getLanguageTranslations } = require('./helper');

const areLanguageTranslationsFullfilled = (lang, keys, translations) => {
  const t = Object.keys(translations)
  return Array.from(keys)
    .reduce((acc, cur) => {
      const result = t.includes(cur);
      if(!result){
        console.error(`❌ [${lang}] is missing the following translation : "${cur}"`);
      }
      return acc && result;
    }, true);
}

function main() {
  Promise.resolve(console.log('Check translations'))
    .then(() => Promise.all(getLanguagesList().map(getLanguageTranslations)))
    .then((languageTranslations) => {
      const keys = new Set();
      
      languageTranslations.forEach(languageTranslation => {
        Object.keys(languageTranslation.translations)
          .forEach(key => {
            keys.add(key);
          })
      });
      return {
        keys,
        languages: languageTranslations
      }
    })
    .then(({keys, languages}) => languages.reduce(
      (acc, language) => acc && areLanguageTranslationsFullfilled(language.lang, keys, language.translations),
      true
    ))
    .then(isValid => {
      if(!isValid){
        console.error('\n❌ Some translations are missing\n')
        throw new Error();
      }
    })
    .then(() => console.log('✔️ Done\n'));
}

/////////
// RUN //
/////////
main();
