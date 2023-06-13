module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "prettier",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "next/core-web-vitals",
    "prettier",
  ],
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": "./tsconfig.json",
  },
  "rules": {
    "prettier/prettier": "error"
  },
  "ignorePatterns": [".eslintrc.js", ".prettierrc.js", "next.config.js"],
};
