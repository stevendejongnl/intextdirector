const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
  FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const plugins = {
  "@typescript-eslint": typescriptEslint,
};

const languageOptions = {
  globals: {
    ...globals.browser,
  },

  parser: tsParser,
  ecmaVersion: "latest",
  sourceType: "module",

  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    project: ["./tsconfig.json"],
  },
};

const settings = {
  "import/resolver": {
    node: {
      extensions: [".js"],
    },
  },
};

const rules = {
  indent: ["error", 2, {
    flatTernaryExpressions: false,
    SwitchCase: 1,

    ignoredNodes: [
      "TemplateLiteral *",
      "PropertyDefinition[decorators]",
      "TSUnionType",
      "FunctionExpression[params]:has(Identifier[decorators])",
    ],
  }],

  "@typescript-eslint/no-non-null-assertion": ["error"],
  "@typescript-eslint/no-explicit-any": ["off"],
  "@typescript-eslint/await-thenable": ["error"],
  "object-curly-spacing": ["error", "always"],
  "linebreak-style": ["error", "unix"],
  quotes: ["error", "single"],
  semi: ["error", "never"],

  "space-before-function-paren": ["error", {
    anonymous: "never",
    named: "never",
    asyncArrow: "always",
  }]
};

const overrides = {
  files: ["src/**/*.ts"],
  plugins,
  languageOptions,
  settings,
  rules,
};

module.exports = [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  overrides,
];
