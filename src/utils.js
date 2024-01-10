const constants = require("./constants");

const getRoleNameByRoleId = (userRoleId) => {
  const [roleName, roleId] = Object.entries(constants.user.roles).find(
    (entry) => userRoleId === entry[1],
  );
  return roleName;
};

const validateEmail = (value) =>
  /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);

const notations = {
  kebabCase: (str) => {
    return str
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  },
  pascalCase: (str) => {
    return str
      .replace(new RegExp(/[-_]+/, "g"), " ")
      .replace(new RegExp(/[^\w\s]/, "g"), "")
      .replace(
        new RegExp(/\s+(.)(\w*)/, "g"),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
      )
      .replace(new RegExp(/\w/), (s) => s.toUpperCase());
  },
  spinalCase: (str) => {
    str = str.trim();
    var regex = /\s+|_+/g;
    str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
    return str.replace(regex, "-").toLowerCase();
  },
  screamingSnakeCase: (str) => {
    str = str.trim();
    var regex = /\s+|_+/g;
    str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
    return str.replace(regex, "_").toUpperCase();
  },
  snakeCase: (str) => {
    return str
      .trim()
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("_");
  },
};

module.exports = { getRoleNameByRoleId, validateEmail, notations };
