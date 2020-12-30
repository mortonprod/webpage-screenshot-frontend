const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
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
    new CleanWebpackPlugin()
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          'html-loader',
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ],
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        test: /\.css$/i,
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
};