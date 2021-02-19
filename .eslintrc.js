module.exports = {
  extends: [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true
  },
  "globals": {
    "fetch": false
  },
  "rules": {
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
    "linebreak-style": ["error", "windows"],
    "react/destructuring-assignment": ["error", "never"],
    "no-console": 0,
    "no-use-before-define": 0
  }
};
