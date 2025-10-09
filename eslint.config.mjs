import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignorePatterns: ['.next/', 'node_modules/'],
    rules: {
      // --- Typescript ---
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // --- React ---
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',

      // --- JS ---
      'no-var': 'off',
      'prefer-const': 'off',
      'no-console': 'warn',

      // --- Next.js ---
      '@next/next/no-img-element': 'off',
      'no-restricted-imports': [
        "error",
        {
          name: "next/link",
          message: "Please import from `@/navigation` instead.",
          importNames: ["default"],
        },
        {
          name: "next/navigation",
          message: "Please import from `@/navigation` instead.",
          importNames: [
            "redirect",
            "permanentRedirect",
            "useRouter",
            "usePathname",
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
