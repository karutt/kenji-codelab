import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';
import chakraUiPlugin from 'eslint-plugin-chakra-ui';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    // ファイル無視の設定
    {
        ignores: ['scripts/**', 'public/sw.js', 'next.config.js'],
    },
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            import: importPlugin,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'off', // VS Codeの自動ソートと競合するため無効化
            'unused-imports/no-unused-imports': 'warn',
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            'chakra-ui': chakraUiPlugin,
        },
        rules: {
            'chakra-ui/props-order': 'warn',
            'chakra-ui/props-shorthand': 'warn',
            'chakra-ui/require-specific-component': 'warn',
        },
    },
];
