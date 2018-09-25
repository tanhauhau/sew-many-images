module.exports = {
    extends: [
      'airbnb',
      'plugin:jest/recommended',
    ],
    plugins: [
      'import',
      'jest',
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
      es6: true,
      node: true,
      'jest/globals': true,
    },
    rules: {
        semi: 2,
        'no-use-before-define': ['error', { 'functions': false, 'classes': false }]
    }
}
