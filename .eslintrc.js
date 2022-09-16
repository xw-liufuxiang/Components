module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  settings: {
    // https://github.com/benmosher/eslint-plugin-import
    // https://cli.vuejs.org/guide/webpack.html#using-resolved-config-as-a-file
    'import/resolver': {
      webpack: {
        config: './node_modules/@vue/cli-service/webpack.config.js',
      },
    },
  },
  rules: {
    'func-names': 'off',
    'linebreak-style': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': 'off',
    'import/extensions': [2, 'never', { 'web.js': 'never', json: 'never' }],
    // "import/no-extraneous-dependencies": [2, { "devDependencies": true }],
    // "import/no-unresolved": [2, { "ignore": ["antd-mobile"] }],
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: { multiline: true, minProperties: 6 },
      },
    ],

    // https://vuejs.org/v2/style-guide/#Multi-attribute-elements-strongly-recommended
    // https://eslint.vuejs.org/rules/max-attributes-per-line.html
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 50,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
};
