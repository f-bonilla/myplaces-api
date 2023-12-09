const i18n = require("i18n");
const mongoose = require("mongoose");

const createError = (status, name, data) => {
  let response = {};
  if (status >= 400 && status < 600) {
    response = new Error();
  }
  response.status = status;
  response.name = name || i18n.__(`states.${status}.name`);
  response.message =
    data && data.message ? data.message : i18n.__(`states.${status}.message`);
  if (data) response.data = data;
  return response;
};

// Middleware mongo errors handling
const handleMongoError = (err, req, res, next) => {
  let errorStatus = null;
  let splittedErrorMessage = err.message.split(":");
  let errorMessage = null;
  if (err instanceof mongoose.Error) {
    errorMessage = splittedErrorMessage[splittedErrorMessage.length - 1].trim();
    switch (err.name) {
      case "ValidationError":
      case "CastError":
        errorStatus = 400;
        break;
      default:
        errorStatus = err.status || 500;
    }
  } else {
    errorMessage = err.message;
    switch (err.name) {
      case "MongoServerError":
        if (err.code === 11000) {
          errorStatus = 409;
          const match = err.message.match(/index: (.+?) dup key: { (.+?) }/);
          if (match) {
            const indexName = match[1];
            const duplicatedFields = match[2].split(", ").map((fieldValue) => {
              const [fieldName, value] = fieldValue.split(": ");
              return fieldName;
            });
            errorMessage = i18n.__(
              "specific_duplicate_field",
              indexName,
              duplicatedFields.join(", "),
            );
          }
        } else {
          errorStatus = err.status || 500;
        }
        break;
      case "MongoTimeoutError":
        errorStatus = 503;
        break;
      default:
        errorStatus = err.status || 500;
    }
  }
  next(createError(errorStatus, err.name, { message: errorMessage }));
};

// Middleware errors handling
const handleGenericError = (err, req, res, next) => {
  // If necessary auth-handler would have created this object
  if (req.error) delete req.error;
  const status = err.status;
  const message = err.message;
  // needed for logger function
  req.message = message;
  res.status(status).json({ error: status, message: message });
};

module.exports = {
  handleMongoError,
  handleGenericError,
  createError,
};
