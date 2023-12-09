const bcrypt = require("bcrypt");

const encrypt = async (value) => {
  const salt = await bcrypt.genSalt(
    parseInt(process.env.USER_PASSWORD_SALT_ROUNDS, 10),
  );
  return await bcrypt.hash(value, salt);
};

const bcryptCompare = (receivedPassword, userPassword) => {
  return bcrypt.compare(receivedPassword, userPassword);
};

module.exports = {
  encrypt,
  bcryptCompare,
};
