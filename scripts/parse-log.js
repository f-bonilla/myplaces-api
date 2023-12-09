const fs = require("fs");

const logFileName = "./logs/2023-10-06.access.log";
const logSeparatorPattern = /\t+/;
const parseLogLine = (line) => {
  const [
    url,
    protocol,
    method,
    status,
    message,
    localDate,
    requestBodyData,
    requestParamsData,
    responseTime,
    userAgent,
    refererUrl,
    remoteIP,
    role,
  ] = line.split(logSeparatorPattern);
  console.log(
    url,
    protocol,
    method,
    status,
    message,
    localDate,
    requestBodyData,
    requestParamsData,
    responseTime,
    userAgent,
    refererUrl,
    remoteIP,
    role,
  );
  console.log("..............................");
};

fs.readFile(logFileName, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split("\n");
  lines.pop();
  for (const line of lines) {
    parseLogLine(line);
  }
});
