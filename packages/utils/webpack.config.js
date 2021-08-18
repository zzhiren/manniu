const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    file: './src/index.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js|\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  // plugins: [
  //   new CopyPlugin({
  //     patterns: [
  //       { from: path.resolve(__dirname, 'types'), to: path.resolve(__dirname, 'lib/types') }
  //     ],
  //   })
  // ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'utils',
    libraryTarget: 'umd'
    // filename: '[name].js',
    // library: ['utils', '[name]'],
    // libraryTarget: 'umd'
  },
}
