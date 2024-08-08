'use strict';

module.exports = {
  "require": [
    "jsdom-global/register",
    "src/helpers/mocha-hooks.ts"
  ],
  "node-option": [
    "import=tsx",
    "env-file=.env.test"
  ]
};
