const Table = require("cli-table3");
const chalk = require("chalk");

module.exports = function (data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  const headers = Object.keys(data[0]).map((header) =>
    chalk.white.bold(header)
  );
  const table = new Table({
    head: headers,
    style: { head: [] },
  });

  const rows = data.map((row) => Object.values(row));
  table.push.apply(table, rows);

  return table.toString();
};
