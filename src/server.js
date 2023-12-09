const i18n = require("i18n");
const { getIpAddress } = require("./network");
const createApp = require("./app");

console.clear();
createApp().then((app) => {
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  app.listen(PORT, () => {
    const ipAddress = getIpAddress();
    console.log("\n\n-------------------------------------------");
    console.log(`${i18n.__("server")} ${ipAddress}:${PORT}`);
    console.log(`${i18n.__("database")} ${process.env.DB_CONNECTION}`);
    console.log("-------------------------------------------");
  });
});
