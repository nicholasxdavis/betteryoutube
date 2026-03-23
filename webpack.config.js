const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    content: './src/content.js',
    popup: './script.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: false // Keep readable for now to ease debugging
  }
};
