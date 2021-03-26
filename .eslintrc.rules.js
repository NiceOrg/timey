/*
  Custom rules for this project
*/
module.exports = {
  'no-console': 'off',
  'func-names': ['error', 'always'],
  'object-curly-spacing': ['error', 'always'],
  curly: 'error',
  'capitalized-comments': 'off',
  'max-statements-per-line': 'off',
  'max-len': ['error', { code: 150, ignoreUrls: true }],
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/no-confusing-void-expression': 'off',
}
