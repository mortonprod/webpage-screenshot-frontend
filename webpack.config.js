const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/assets/js/index.js',
    canvas: './src/assets/js/canvas.js'
  },
  externals: {
    'jquery': 'jQuery'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html' },
        { from: 'src/canvas.html', to: 'canvas.html' },
      ]
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        type: 'asset/resource',
        generator: { filename: '[name][ext]' }
      },
      {
        test: /\.mp4$/,
        type: 'asset/resource',
        generator: { filename: '[name][ext]' }
      },
      {
        test: /\.(png|jpg|gif|jpeg|ico)$/,
        type: 'asset/resource',
        generator: { filename: '[name][ext]' }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
};
