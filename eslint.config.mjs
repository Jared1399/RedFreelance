import { dirname } from "path";
import { fileURLToPath } from "url";
import { globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    "rules": {
      "max-len": ["error", { "code": 100, "comments": 120 }],
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "semi": ["error", "always"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    },

  },
  globalIgnores([
    "src/generated/*"
  ])
];

export default eslintConfig;
