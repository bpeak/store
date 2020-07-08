const path = require('path');

console.log(__dirname)

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', './dist/index.umd.js'],
  output: {
    library: 'Store',
    filename: 'index.umd.polfilled.js',
    path: path.resolve(__dirname, 'dist'),
  },
};