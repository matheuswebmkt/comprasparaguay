// Filepath: eslint.config.mjs
// Version: 2.0
// Nome da Versão: "Corrige Regra de Variável Não Utilizada (Flat Config)"
// Baseado na Versão: 1.0

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// A nova configuração de regras é adicionada ao array exportado.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  }
];

export default eslintConfig;