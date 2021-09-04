module.exports = {
  extends: ["react-app", "plugin:fp-ts/all"],
  plugins: ["fp-ts"],
  rules: {
    "array-callback-return": "off",
    "no-fallthrough": "off",
    "@typescript-eslint/no-redeclare": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/jsx-pascal-case": "off",
    "react/jsx-curly-brace-presence": "warn",
    "fp-ts/no-module-imports": [
      "error",
      {
        allowTypes: true,
        allowedModules: ["function", "Apply"]
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["*", "default"],
            message:
              "React is not needed in scope anymore when using JSX. NOTE: TypeScript should mark it as unused and avoid suggesting it for autocompletion, but this is currently buggy. It will be fixed in a future version of TypeScript."
          },
          {
            name: "io-ts-types",
            message:
              "importing from io-ts-types will likely cause typechecking to fail, since it brings in peerDependencies that we don't depend on, such as monocle-ts, or newtype-ts. Please import from the specific submodule instead."
          }
        ],
        patterns: ["design-system/lib/*", "!design-system/lib/styleConstants"]
      }
    ],
    "import/no-duplicates": "error"
  }
};
