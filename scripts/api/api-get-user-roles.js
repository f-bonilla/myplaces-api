const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { loadNodeEnv } = require("../../src/utils");
const UserRoleModel = require("../../src/user/user-model-role");

loadNodeEnv();

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
    });

    const userRoles = await UserRoleModel.find();
    const constants = {};
    userRoles.forEach((userRole) => {
      constants[userRole.key.toUpperCase()] = userRole.key;
    });

    const outputPath = path.join(__dirname, "..", "..", "src", "constants.js");
    fs.writeFileSync(
      outputPath,
      `module.exports = ${JSON.stringify(constants, null, 2)};\n`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
})();
