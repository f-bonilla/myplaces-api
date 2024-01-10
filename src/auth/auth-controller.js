const i18n = require("i18n");
const constants = require("../constants");
const mailing = require("../mailing/mailing-handler");
const { generateToken, validateToken } = require("../auth/auth-handler");
const { encrypt, bcryptCompare } = require("../crypt-handler");
const createError = require("../error-handler").createError;
const {
  additionalResponseData,
  additionalResponseKeys,
} = require("../additional-data-handler");
const UserController = require("../user/user-controller").api;

const sendWelcomeEmail = async (email, token) => {
  const emailSent = await mailing.send(
    { to: email, token: token },
    mailing.templates.WELCOME,
  );
  return !(emailSent instanceof Error);
};

const isUser = (role) => role !== constants.user.roles.GUEST;
const userConfirmed = (res, user) => {
  return user.token && isUser(user.role)
    ? additionalResponseData.add(
        res,
        additionalResponseKeys.CONFIRMED_EMAIL,
        false,
      )
    : res;
};
const checkWelcomeEmail = async (req, res, next, user) => {
  try {
    if (!user.welcome_email) {
      req.params.id = user.id;
      req.body.updateData = {};
      req.body.updateData.welcome_email = await sendWelcomeEmail(
        user.email,
        user.token,
      );
      await UserController.executePatch(req);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await UserController.executeRead({ email: req.body.email });
    if (!user) return next(createError(401));
    const isValidPassword = await bcryptCompare(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) return next(createError(401));
    // If the user has not yet confirmed the email, additionalData is sent in the response
    res = userConfirmed(res, user);
    const userToken = generateToken({ id: user._id, role: user.role });
    user.token = userToken;
    await checkWelcomeEmail(req, res, next, user);
    res.setHeader("Authorization", `Bearer ${userToken}`);
    res.status(200).json({ message: i18n.__("logged"), ...res.additionalData });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const encryptedPassword = await encrypt(password);
    req.body = {
      email: email,
      password: encryptedPassword,
      role: role || constants.user.roles.USER,
      welcome_email: false,
    };
    const user = await UserController.executeCreate(req, res, next);
    user.token = generateToken({ id: user._id, role: role });
    user.welcome_email = await sendWelcomeEmail(email, user.token);
    await user.save();
    res.setHeader("Authorization", `Bearer ${user.token}`);
    res.status(201).send({
      message: i18n.__("states.201.message"),
      user_uri: `/users/${user._id}`,
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  req.user = { role: constants.user.roles.GUEST };
  res.status(204).end();
};

const confirmUser = async (req, res, next) => {
  try {
    const user = validateToken(req.query.token);
    req.params.id = user.id;
    req.body.updateData = {
      token: null,
    };
    await UserController.executePatch(req, res, next);
    res.status(200).send({ message: i18n.__("mailing.verified_email") });
  } catch (err) {
    const errName = err.name;
    const errMessage = err.message;
    let statusCode = 500; // Other errors(TypeError, custom errors...)
    switch (errName) {
      case "JsonWebTokenError":
      case "NotBeforeError":
      case "TokenExpiredError":
        statusCode = 401;
        break;
    }
    next(createError(statusCode, errName, errMessage));
  }
};

module.exports = {
  login,
  register,
  logout,
  confirmUser,
};
