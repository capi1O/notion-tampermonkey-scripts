import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: {
			js,
		},
		extends: ['js/recommended'],
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			'indent': ['error', 'tab'],
			'no-tabs': 'off',
			'quotes': ['error', 'single'],
			'prefer-arrow-callback': ['error'],
  	  'func-style': ['error', 'expression'],
			'semi': ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
		},
		ignores: ['dist/**'],
	},
	{
		files: ['**/*.json'],
		plugins: {
			json,
		},
		language: 'json/json',
		extends: ['json/recommended'],
		ignores: ['package-lock.json'],
	},
	{
		files: ['**/*.md'],
		plugins: {
			markdown,
		},
		language: 'markdown/gfm',
		extends: ['markdown/recommended'],
	},
]);