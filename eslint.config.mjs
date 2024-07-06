import globals from "globals";
import pluginJs from "@eslint/js";
import { configs as dependConfigs } from "eslint-plugin-depend";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  dependConfigs["flat/recommended"],
];
