const levenshtein = require("js-levenshtein");

const sortFn = (word) => (a, b) => levenshtein(word, a) - levenshtein(word, b);

module.exports = function (word, tests) {
  const testsCopy = tests.slice(0);
  return testsCopy.sort(sortFn(word))[0];
};
