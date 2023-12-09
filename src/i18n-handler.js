const i18n = require("i18n");
const path = require("path");

const i18nConfigure = () => {
  const defaultLang = "es";
  i18n.configure({
    locales: ["es", "en"],
    directory: path.join(__dirname, "assets", "json", "locales"),
    fallbacks: { "*": defaultLang },
    objectNotation: true,
    logWarnFn: (message, defaultMessage, level, meta) => {
      console.warn(`message: ${message}`);
      console.warn(`defultMessage: ${defaultMessage}`);
      console.warn(`level: ${level}`);
      console.warn(`meta: ${meta}`);
    },
  });
  // NOTE: always after i18n.configure
  i18n.setLocale(defaultLang);
};

module.exports = {
  i18nConfigure,
};
