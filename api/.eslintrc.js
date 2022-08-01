module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "prettier/prettier": [
      "error",
      {
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        useTabs: false,
        arrowParens: "avoid",
        endOfLine: "lf",
      },
    ],
  },
};
