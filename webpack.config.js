const path = require('path');

module.exports = {
  entry: './src/server.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};