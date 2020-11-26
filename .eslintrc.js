module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "arrow-body-style": ["error", "always"],
    "no-console": "warn",
    "import/extensions": ["error", "always"],
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "all",
      },
    ],
    indent: ["error", 2],
    'no-multi-spaces': ['error'],
    "jest/consistent-test-it": ["error", { fn: "it" }],
  },
};
