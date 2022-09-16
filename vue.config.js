const path = require('path');
const sass = require('sass');
process.env.VUE_APP_RELEASE = require('./package').release;

module.exports = {
  publicPath: '/Components',
  outputDir: 'dist/Components',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  transpileDependencies: ['axios'],

  configureWebpack: {
    name: 'Components',
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
    module: {
      rules: [
        // 配置读取 *.md 文件的规则
        {
          test: /\.md$/,
          use: [
            { loader: 'html-loader' },
            { loader: 'markdown-loader', options: {} },
          ],
        },
      ],
    },
  },

  css: {
    loaderOptions: {
      sass: {
        implementation: sass,
      },
    },
  },
};
