const { getConfig } = require("./global-config");
const fs = require("fs");
const os = require("os");

const apps = JSON.parse(
  fs.readFileSync(getConfig().config.replace("~", os.homedir()), {
    encoding: "utf8",
  })
);

const get = (name) => apps.find((app) => app.id === name);

module.exports = { apps, get };
