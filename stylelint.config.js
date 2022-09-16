module.exports = {
  extends: 'stylelint-config-standard',
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'max-empty-lines': 2,
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['extend', 'at-root', 'debug', 'warn', 'error', 'if', 'else', 'for', 'each', 'while', 'mixin', 'include', 'content', 'return', 'function'],
    }],
    'media-feature-name-no-unknown': [true, {
      ignoreMediaFeatureNames: ['min-device-pixel-ratio'],
    }],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep'],
      },
    ],
  },
};
