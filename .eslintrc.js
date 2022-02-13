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
        curly: ["error", "multi-line"],
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "prefer-const": ["error", { destructuring: "all" }],
        "camelcase": "off",
        "no-empty-function": "off",
        "no-inner-declarations": "off",
        "no-constant-condition": ["error", { "checkLoops": false }],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true }],
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/restrict-template-expressions": ["error", {
            allowAny: true,
            allowBoolean: true,
            allowNullish: true,
        }],
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    String: {
                        message: "Use string instead",
                        fixWith: "string",
                    },
                    Boolean: {
                        message: "Use boolean instead",
                        fixWith: "boolean",
                    },
                    Number: {
                        message: "Use number instead",
                        fixWith: "number",
                    },
                    Symbol: {
                        message: "Use symbol instead",
                        fixWith: "symbol",
                    },

                    Function: {
                        message: [
                            "The `Function` type accepts any function-like value.",
                            "It provides no type safety when calling the function, which can be a common source of bugs.",
                            "It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.",
                            "If you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
                        ].join("\n"),
                    },

                    Object: {
                        message: [
                            "The `Object` type actually means \"any non-nullish value\", so it is marginally better than `unknown`.",
                            "- If you want a type meaning \"any object\", you probably want `Record<string, unknown>` instead.",
                            "- If you want a type meaning \"any value\", you probably want `unknown` instead.",
                        ].join("\n"),
                    }
                },
                extendDefaults: false
            }
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "default",
                "format": ["camelCase"]
            },

            {
                "selector": "variable",
                "format": ["camelCase"]
            },

            {
                "selector": "parameter",
                "format": ["camelCase"]
            },

            {
                "selector": "memberLike",
                "format": ["camelCase"]
            },

            {
                "selector": "typeLike",
                "format": ["PascalCase"]
            },

            {
                "selector": "objectLiteralProperty",
                "format": ["camelCase", "snake_case", "PascalCase"]
            },

            {
                "selector": "method",
                "format": ["camelCase"]
            },

            {
                "selector": "classMethod",
                "format": ["PascalCase", "camelCase"]
            },

            {
                "selector": "interface",
                "format": null,
                "filter": {
                    "regex": "DOTA|Dota",
                    "match": true
                }
            }
        ]
    }
};
