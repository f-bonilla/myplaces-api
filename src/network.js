const os = require("os");

const getIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const { address, family } of networkInterface) {
      if (family === "IPv4" && !address.startsWith("127.")) {
        return address;
      }
    }
  }
  return "localhost";
};

module.exports = {
  getIpAddress,
};
