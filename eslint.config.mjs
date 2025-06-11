import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import { defineFlatConfig } from "eslint-define-config";

export default defineFlatConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser, 
        ...globals.node, 
        ...globals.serviceworker, 
        ...globals.es2021, 
        React: "readonly", 
        JSX: "readonly", 
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-namespace": "off", 
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react/react-in-jsx-scope": "off", 
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "off",
    },
  },
]);