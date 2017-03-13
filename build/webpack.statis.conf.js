var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var isStatis = !!(process.argv[2] == 'statis')

var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
  }),
  new ExtractTextPlugin({
    filename: "[name].css"
  }),
  new webpack.HotModuleReplacementPlugin()
]

if (isStatis) {
  plugins.push(new OptimizeCSSPlugin())
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
       compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  )
}
module.exports = {
  entry: {
    // app: ['webpack/hot/dev-server', path.join(__dirname, '../src/statis-month.js')],
    month: path.join(__dirname, '../src/statis-month.js'),
    year: path.join(__dirname, '../src/statis-year.js')
  },
  output: {
    path: path.join(__dirname, '../public/statis'),
    publicPath: 'statis',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!stylus-loader"
        })
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  // resolve: {
  //   extensions: ['.js'],
  //   fallback: [path.join(__dirname, './node_modules')]
  // },
  plugins: plugins
};
