module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            "src/vscripts/tsconfig.json",
            "src/panorama/tsconfig.json",
        ]
    },
    plugins: [
        "@typescript-eslint",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier"
    ],
    rules: {
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
    }
};
