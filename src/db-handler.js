const mongoose = require("mongoose");
const createError = require("./error-handler").createError;
const constants = require("./constants");

let state = 0;

const dbConnect = async (url) => {
  let connected = false;
  let connectionAttempts = 0;
  const maxConnectionAttempts = 3;
  while (!connected && connectionAttempts < maxConnectionAttempts) {
    try {
      await mongoose.connect(url, {
        serverSelectionTimeoutMS: 2500, // connection timeout
        autoIndex: false, // Set autoIndex to false to avoid creating the database if it doesn't exist
      });
      mongoose.set("bufferTimeoutMS", 10000); // request timeout (default value: 10000)
      connected = true;
    } catch (err) {
      connectionAttempts++;
    } finally {
      state = mongoose.connection.readyState;
    }
  }
};

const checkDatabaseConnection = (() => {
  return (req, res, next) => {
    if (state === 0) {
      // logger.js needs this object to print errors
      req.user = { role: constants.GUEST };
      return next(createError(503));
    }
    next();
  };
})();

const getDbState = () => state;

module.exports = {
  dbConnect,
  checkDatabaseConnection,
  getDbState,
};
