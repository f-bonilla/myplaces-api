const i18n = require("i18n");

const changeLang = (req, res) => {
  i18n.setLocale(req.params.lang);
  res.status(200).json({
    error: 0,
    message: i18n.__("language_change"),
  });
};

module.exports = {
  changeLang,
};
