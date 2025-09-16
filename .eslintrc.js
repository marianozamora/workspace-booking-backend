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
		// General ESLint rules
		"prefer-const": "error",
		"no-var": "error",
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"eqeqeq": "error",
		"curly": "error",
		
		// Disable problematic rules for now
		"no-unused-vars": "off",

		// Code style - compatible with existing codebase
		"indent": ["error", "tab", { SwitchCase: 1 }],
		"quotes": ["error", "double", { avoidEscape: true }],
		"semi": ["error", "always"],
		"comma-dangle": "off",
		"object-curly-spacing": ["error", "always"],
		"array-bracket-spacing": ["error", "never"],
	},
};
