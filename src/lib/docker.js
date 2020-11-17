const fs = require("fs");
const Docker = require("dockerode");

const docker = new Docker();

// Create same format docker ps uses
const port = (port) =>
  `${port.IP}:${port.PrivatePort}->${port.PublicPort}/${port.Type}`;

// Names starts with /, remove it as it looks ugly
const name = (names) => names.map((name) => name.replace(/^\//, "")).join(", ");

const container = (container) => ({
  id: container.Id,
  name: name(container.Names),
  ports: container.Ports.map(port).join(","),
  status: container.Status,
  running: container.State === "running",
});

const list = (all = false) =>
  docker
    .listContainers({ all: all })
    .then((containers) => containers.map(container))
    .catch(console.log);

const get = (app, all = false) =>
  list(all).then((containers) =>
    containers.find((container) => container.name.includes(app.docker.name))
  );

const create = (app) => {
  const home = "/Users/bendiksolheim/bekk/kunder/vegvesen";

  const containerConfig = {
    Image: app.docker.image,
    name: app.docker.name,
    AttachStdIn: false,
    AttachStdOut: true,
    AttachStdErr: true,
    Cmd: ["/bin/bash", "-c", app.docker.cmd],
    Env: ["LOCAL_HOST=192.168.65.2", "TZ=Europe/Oslo"],
    Tty: true,
    ExposedPorts: app.docker.ports
      .map((port) => `${port}/tcp`)
      .reduce((acc, cur) => {
        acc[cur] = {};
        return acc;
      }, {}),
    HostConfig: {
      Binds: [`${home}/${app.docker.path}:/home`],
      PortBindings: app.docker.ports
        .map((port) => [`${port}/tcp`, `${port}`])
        .reduce((acc, cur) => {
          acc[cur[0]] = [{ HostPort: cur[1] }];
          return acc;
        }, {}),
    },
  };

  return docker.createContainer(containerConfig);
};

const start = (app) =>
  get(app, true)
    .then((container) => {
      if (container) {
        return docker.getContainer(container.id);
      } else {
        return create(app);
      }
    })
    .then((container) => {
      if (container.State !== "running") {
        container.start();
      }
    });

const stop = (app) =>
  get(app)
    .then((container) => {
      if (container) return docker.getContainer(container.id);
    })
    .then((container) => {
      if (container) return container.stop();
    });

const remove = (app) =>
  get(app, true)
    .then((container) => {
      if (container) return docker.getContainer(container.id);
    })
    .then((container) => {
      if (container) container.remove();
    });

module.exports = {
  list,
  get,
  start,
  stop,
  remove,
};
