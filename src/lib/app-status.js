const docker = require("./docker");
const table = require("./table");

module.exports = function (app) {
  docker.list().then((containers) => {
    const container = containers.find((container) =>
      container.name.includes(app)
    );

    if (container) {
      console.log(table(container));
    } else {
      console.log(`${app} not found in containers`);
    }
  });
};
