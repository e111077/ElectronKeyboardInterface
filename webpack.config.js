const path = require('path');

module.exports = {
  entry: './view/src/electron-keyboard-interface.ts',
  devtool: 'inline-source-map',
  optimization: {
    minimizer: []
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'view/dist')
  }
};