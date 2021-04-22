const rules = require('./.eslintrc.rules.js')

// try standard-with-typescript

module.exports = {
  root: true,
  env: {
    browser: true,
    mocha: true,
    node: true,
  },
  extends: ['plugin:unicorn/recommended', '@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: ['unicorn', 'prettier'],
  rules,
}
