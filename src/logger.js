const fs = require("fs");
const morgan = require("morgan");

const anonymizeIP = (ip) => {
  let maskedUrl = null;
  let mask = "xxx";
  let ipvSeparator = null;
  if (ip.includes(":")) {
    maskedUrl = ip.split(":");
    ipvSeparator = ":";
  } else {
    maskedUrl = ip.split(".");
    ipvSeparator = ".";
  }
  maskedUrl.pop();
  maskedUrl.push(mask);
  return maskedUrl.join(ipvSeparator);
};

const formattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}:${second}`,
  };
};

const colors = {
  white: "\x1b[37m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
  brightBlue: "\x1b[94m%s\x1b[0m",
  brightRed: "\x1b[91m%s\x1b[0m",
};

const getIP = (req) =>
  req.headers["x-real-ip"] ||
  req.headers["x-forwarded-for"] ||
  req.socket.remoteAddress;

const getRefererUrl = (req) => {
  return req.get("Referer") || req.get("host");
};

const logger = (req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    let log = console.log;
    let color = colors["white"];
    res.on("finish", () => {
      const statusCode = res.statusCode;
      if (statusCode >= 100 && statusCode < 200) {
        log = console.info;
        color = colors["cyan"];
      } else if (statusCode >= 200 && statusCode < 300) {
        // default settings: log = console.log, color: white
      } else if (statusCode >= 300 && statusCode < 400) {
        log = console.warn;
        color = colors["brightBlue"];
      } else if ((statusCode >= 400 && statusCode < 500) || statusCode >= 500) {
        log = console.error;
        color = colors["brightRed"];
      }
      const message =
        req.message ||
        res.statusMessage ||
        "Warning(2): Response without message";
      const refererUrl = getRefererUrl(req);
      const remoteIP = anonymizeIP(getIP(req));
      const userRole = req.user.role;
      log(
        color,
        `${userRole} ${req.protocol.toUpperCase()} ${req.method} ${
          res.statusCode
        } ${req.originalUrl} ${message} ${formattedDateTime().date},${
          formattedDateTime().time
        } ${refererUrl} ${remoteIP}`,
      );
    });
  }

  next();
};

const accessLogger = (req, res, next) => {
  const logsPath = require("path").join(
    process.cwd(),
    `${process.env.LOG_FILE_PATH}/${formattedDateTime().date}.access.log`,
  );
  const accessLogStream = fs.createWriteStream(logsPath, { flags: "a" });
  morgan.token("localDate", () => {
    return `${formattedDateTime().date},${formattedDateTime().time}`;
  });
  morgan.token("protocol", (req) => {
    return req.protocol.toUpperCase();
  });
  morgan.token("message", (req, res) => {
    return req.message || res.statusMessage;
  });
  morgan.token("remoteIP", (req) => {
    return anonymizeIP(getIP(req));
  });
  morgan.token("refererUrl", (req) => {
    return getRefererUrl(req);
  });
  morgan.token("userRole", (req) => {
    return req.user.role;
  });
  morgan(
    ":url\t:protocol\t:method\t:status\t:message\t:localDate\t:response-time ms\t:user-agent\t:refererUrl\t:remoteIP\t:userRole",
    { stream: accessLogStream },
  )(req, res, next);
};

module.exports = {
  logger,
  accessLogger,
};
