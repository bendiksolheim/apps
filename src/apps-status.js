const Docker = require("dockerode");
const { apps } = require("./lib/apps");
const chalk = require("chalk");
const table = require("./lib/table");
const docker = require("./lib/docker");

const makeRow = (containers) => (app, id) => ({
  id,
  name: app.name,
  deps: app.dependencies
    .map((dep) =>
      containers.some((c) => c.name.includes(dep))
        ? chalk.green(dep)
        : chalk.red(dep)
    )
    .join(", "),
  status: chalk.green(
    containers.find((c) => c.name.includes(app.docker.name))?.status ?? ""
  ),
});

const makeRows = (apps) => (containers) => apps.map(makeRow(containers));

const getData = (apps) => docker.list().then(makeRows(apps));

getData(apps.apps).then((rows) => {
  console.log(table(rows));
});
