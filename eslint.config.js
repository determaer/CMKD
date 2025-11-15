// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import vueParser from "vue-eslint-parser";
export default [
  // add more generic rulesets here, such as:
  // js.configs.recommended,

  ...pluginVue.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // <script lang="ts" /> to enable TypeScript in Vue SFC
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
    },
  },
  {
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },
  },

  {
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
      "vue/multi-word-component-names": "off",
      "vue/attribute-hyphenation": "off",
      ...prettierConfig.rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
  ...storybook.configs["flat/recommended"],
];
