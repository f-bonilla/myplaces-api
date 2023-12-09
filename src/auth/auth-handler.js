const i18n = require("i18n");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const constants = require("../constants");
const createError = require("../error-handler").createError;

const formatPathToAclResource = (path) => {
  path = path.replace(/\/+$/, "");
  const match = path.match(/^\/([^/]+)\/([^/]+)/);
  if (match) {
    const resource = match[1];
    const id = match[2];
    // valid mongoose ObjectId
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id) ? `/${resource}/:id` : path;
  } else {
    return path;
  }
};

const loadPermissions = () => {
  try {
    const aclData = fs.readFileSync(
      path.join(__dirname, "../assets/json/", "ACL.json"),
      "utf8",
    );
    acl = JSON.parse(aclData);
  } catch (err) {
    acl = err;
    acl.message = i18n.__("acc_load_error");
  }
};

const generateToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_TOKEN_TIME, 10),
  });
  return token;
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const checkSessionToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader ? authHeader.split(" ")[1] : null;
  req.user = { role: constants.GUEST };
  try {
    if (authToken) {
      req.user = validateToken(authToken);
    }
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
    // checkUserRole function needs to know about this error to manage access permissions
    req.error = {
      statusCode: statusCode,
      name: errName,
      message: errMessage,
    };
  }
  next();
};

let acl = null;
const checkUserRole = (req, res, next) => {
  if (acl instanceof Error)
    return next(createError(500, null, { message: acl.message }));
  const method = req.method.toLowerCase();
  const resource = formatPathToAclResource(req.path, method);
  if (!acl[resource]) return next(createError(404));

  const user = req.user;
  const allowedUser = acl[resource][method].includes(user.role);
  const sessionError = req.error;
  if (user.role === constants.GUEST && allowedUser) {
    next();
  } else if (allowedUser && !sessionError) {
    next();
  } else {
    if (req.error) {
      console.log("error", JSON.stringify(req.error));
      console.log("user", JSON.stringify(req.user));
      console.log("resource", resource);
      console.log("acl[resource][method]", acl[resource][method]);
    }
    const errorName = req.error ? req.error.name : null;
    const errorMessage = req.error ? req.error.message : {};
    next(createError(403, errorName, errorMessage));
  }
};

module.exports = {
  validateToken,
  loadPermissions,
  generateToken,
  checkSessionToken,
  checkUserRole,
};
