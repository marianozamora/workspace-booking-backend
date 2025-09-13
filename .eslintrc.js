module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
		project: "./tsconfig.json",
	},
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"@typescript-eslint/recommended",
		"@typescript-eslint/recommended-requiring-type-checking",
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es6: true,
	},
	ignorePatterns: [
		".eslintrc.js",
		"dist/",
		"coverage/",
		"node_modules/",
		"*.js",
	],
	rules: {
		// TypeScript specific rules
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "warn",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"@typescript-eslint/prefer-const": "error",
		"@typescript-eslint/no-var-requires": "error",

		// General ESLint rules
		"prefer-const": "error",
		"no-var": "error",
		"no-console": ["warn", { allow: ["warn", "error"] }],
		eqeqeq: "error",
		curly: "error",

		// Code style
		indent: ["error", 2, { SwitchCase: 1 }],
		quotes: ["error", "single", { avoidEscape: true }],
		semi: ["error", "never"],
		"comma-trailing": "off",
		"object-curly-spacing": ["error", "always"],
		"array-bracket-spacing": ["error", "never"],
	},
};
