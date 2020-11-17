const { Command } = require("commander");
const apps = require("./lib/apps");
const levenshtein = require("./lib/levenshtein");
const docker = require("./lib/docker");

const program = new Command();

const logError = (name) => {
  console.error(
    `${name} is not a known app, did you mean ${levenshtein(
      name,
      apps.apps.map((a) => a.id)
    )}?`
  );
};

program.arguments("<app-name>").action((name) => {
  const app = apps.get(name);
  if (!app) {
    logError(name);
  } else {
    docker.stop(app).then(() => {
      docker.remove(app);
    });
  }
});

program.parse(process.argv);
