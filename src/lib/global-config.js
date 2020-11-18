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

let cachedConfig = null;

// Assumes that a config exists. Fails otherwise.
function config() {
  if (cachedConfig == null) {
    const configFile = configs.filter(exists)[0].replace("~", os.homedir());
    const tempConfig = JSON.parse(
      fs.readFileSync(configFile, { encoding: "utf8" })
    );

    cachedConfig = {
      home: tempConfig.home.replace("~", os.homedir()),
      config: tempConfig.config.replace("~", os.homedir()),
    };
  }

  return cachedConfig;
}

module.exports = {
  verifyConfigExists,
  config,
};
