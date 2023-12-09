const i18n = require("i18n");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");
const { i18nConfigure } = require("./i18n-handler");
const { loadNodeEnv } = require("./env-handler");
const { logger, accessLogger } = require("./logger");
const { dbConnect, checkDatabaseConnection } = require("./db-handler");
const { handleMongoError, handleGenericError } = require("./error-handler");
const auth = require("./auth/auth-handler");
const authRoutes = require("./auth/auth-routes");
const languageRoutes = require("./language/language-routes");
const placeRoutes = require("./place/place-routes");
const placeOptionRoutes = require("./place-option/place-option-routes");
const placeOptionTypeRoutes = require("./place-option-type/place-option-type-routes");
const placeStateRoutes = require("./place-state/place-state-routes");
const userRoutes = require("./user/user-routes");

let app = express();
const createApp = async () => {
  loadNodeEnv();
  i18nConfigure();
  app.use(i18n.init);
  auth.loadPermissions();
  await dbConnect(process.env.DB_CONNECTION);
  app.set("trust proxy", true);
  app.use(
    cors({
      exposedHeaders: ["Authorization"],
      origin: [
        "http://127.0.0.1:64053",
        "http://localhost:9000",
        "http://192.168.1.35:9000",
      ],
    }),
  );
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/assets", express.static("src/assets"));
  app.use(favicon(path.join(__dirname, "assets", "favicon.ico")));
  app.use(logger, accessLogger);
  app.use(checkDatabaseConnection);
  app.use(auth.checkSessionToken, auth.checkUserRole);

  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/places", placeRoutes);
  app.use("/place-options", placeOptionRoutes);
  app.use("/place-option-types", placeOptionTypeRoutes);
  app.use("/place-states", placeStateRoutes);
  app.use("/languages", languageRoutes);

  app.use("*", handleMongoError, handleGenericError);

  return app;
};

module.exports = createApp;
