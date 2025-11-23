import globals from "globals";
import pluginJs from "@eslint/js";
import { globalIgnores } from "eslint/config";
import { configs as dependConfigs } from "eslint-plugin-depend";

export default [
  {
    files: ["statics/js/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  dependConfigs["flat/recommended"],
  globalIgnores(["public/"]),
];
