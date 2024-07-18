import { readdirSync, readFileSync, copyFileSync, mkdirSync } from "fs";

const SRC_FOLDER = `${__dirname}/../src/i18n`;
const PUBLIC_FOLDER = `${__dirname}/../public/i18n`;

const getLanguagesList = () =>
  readdirSync(SRC_FOLDER, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getLanguageTranslations = (lang) =>
  Promise.resolve()
    .then(() => readFileSync(`${SRC_FOLDER}/${lang}/index.json`))
    .then(JSON.parse)
    .then((translations) => ({
      lang,
      translations,
    }));

const copyLanguageToPublicFolder = (lang) => {
  try {
    mkdirSync(`${PUBLIC_FOLDER}/${lang}`);
  } catch (e) {
    //do nothing
  }

  copyFileSync(
    `${SRC_FOLDER}/${lang}/index.json`,
    `${PUBLIC_FOLDER}/${lang}/index.json`
  );
};

module.exports = {
  getLanguageTranslations,
  getLanguagesList,
  copyLanguageToPublicFolder,
};
