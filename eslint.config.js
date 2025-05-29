// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintPluginAstro from "eslint-plugin-astro";
export default [
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  ...storybook.configs["flat/recommended"]
];
