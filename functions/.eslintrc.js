module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // ✅ ZMIANA: Dodaliśmy tę linię
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};