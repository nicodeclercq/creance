import { writeFileSync } from "node:fs";
import {
  getLanguagesList,
  getLanguageTranslations,
  copyLanguageToPublicFolder,
} from "./helper";

const toString = (
  keys
) => `/*********************************************************/
/** /!\ WARNING: this is a generated file do not modify **/
/*********************************************************/

export type Translation =
  ${keys.map((key) => `'${key}'`).join(` 
  | `)};
`;

function main() {
  Promise.resolve(console.log("Compile translations"))
    .then(() => Promise.all(getLanguagesList().map(getLanguageTranslations)))
    .then((languageTranslations) => {
      const keys = new Set();

      languageTranslations.forEach((languageTranslation) => {
        copyLanguageToPublicFolder(languageTranslation.lang);

        Object.keys(languageTranslation.translations).forEach((key) => {
          keys.add(key);
        });
      });

      return toString(Array.from(keys));
    })
    .then((types) =>
      writeFileSync(`${__dirname}/../src/@types/translations.d.ts`, types)
    )
    .then(() => console.log("✔️ Done\n"));
}

/////////
// RUN //
/////////
main();
