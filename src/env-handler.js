const dotenv = require("dotenv");

const loadNodeEnv = () => {
  const env = dotenv.config();
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
};

module.exports = {
  loadNodeEnv,
};
