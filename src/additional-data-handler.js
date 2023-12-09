const i18n = require("i18n");

const additionalResponseKeys = {
  CONFIRMED_EMAIL: "CONFIRMED_EMAIL",
};

// adds additional information to the response, at the moment the only case is to notify the client of the need to validate the email
const additionalResponseData = (() => {
  return {
    add: (res, key, value) => {
      if (!res.additionalData) res.additionalData = {};
      res.additionalData[key] = additionalResponseKeys.hasOwnProperty(key)
        ? (res.additionalData[key] = value)
        : (res.additionalData[key] = i18n.__(
            "additional_data.invalid_key",
            key,
          ));
      return res;
    },
  };
})();

module.exports = { additionalResponseData, additionalResponseKeys };
