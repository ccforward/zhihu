const config = require('./config')
const utils = require('./utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  // postcss: [
  //   require('autoprefixer')({
  //     browsers: ['last 2 versions']
  //   })
  // ],
  stylus: ExtractTextPlugin.extract({
    loader: 'css-loader!stylus-loader',
    fallback: 'vue-style-loader'
  })
}