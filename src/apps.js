#!/usr/bin/env node

const { Command } = require("commander");
const { verifyConfigExists } = require("./lib/global-config");

verifyConfigExists();

const program = new Command();

program
  .version("0.0.1")
  .description("Handle micro services with ease.")
  .command("status", "Lists all apps")
  .command("start <app>", "Launch apps in docker")
  .command("stop <app>", "Stop apps running in docker");

program.parse(process.argv);
