const path = require('path');
const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env)
  function resolve(dir) {
    return path.join(__dirname, '..', dir)
  }
  config.resolve = {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  }
  return config
}
