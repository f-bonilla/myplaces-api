const createApp = require("./src/app");

let app;
const getApp = async () => {
  if (!app) app = await createApp();
  return app;
};

const generateObjectId = () =>
  [...Array(24)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const generateRandomEmail = () => {
  const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "example.com",
  ];
  const randomUsername = Math.random().toString(36).substring(7);
  const randomDomain =
    emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const randomEmail = `${randomUsername}@${randomDomain}`;
  return randomEmail;
};

const getUserData = () => {
  return {
    email: generateRandomEmail(),
    password: "P@ssW0rd",
  };
};

const getPlaceData = () => {
  return {
    user: generateObjectId(),
    name: "Volkman - Hermann",
    address: "930 Eugene Avenue",
    state: generateObjectId(),
    province: "901",
    locality: "857",
    place_option: generateObjectId(),
    place_option_type: generateObjectId(),
    public: false,
    votes: 1,
  };
};

module.exports = { getApp, getUserData, getPlaceData };
