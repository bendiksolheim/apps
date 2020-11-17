const fs = require("fs");
const chalk = require("chalk");
const os = require("os");

const configs = ["~/.apps.json", "~/.config/apps/apps.json"];

function exists(path) {
  return fs.existsSync(path.replace("~", os.homedir()));
}

function verifyConfigExists() {
  const configExists = configs.some(exists);
  if (!configExists) {
    const error = `${chalk.red("No config found!")}
Create a file called either ${configs.join(" or ")} with the following content:
{
  "config": "path/to/actual/config/apps.json",
  "home": "path/to/apps/home"
}
`;
    console.error(error);
    process.exit(1);
  }
}

// Assumes that a config exists. Fails otherwise.
function getConfig() {
  const config = configs.filter(exists)[0].replace("~", os.homedir());
  return JSON.parse(fs.readFileSync(config, { encoding: "utf8" }));
}

module.exports = {
  verifyConfigExists,
  getConfig,
};
