import globals from "globals";
import pluginJs from "@eslint/js";

// Export default configuration array
export default [
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended
];
