module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "import/no-anonymous-default-export": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
