var path = require('path');
// var nib = require('nib');
var webpack = require('webpack');
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var utils = require('./utils');
var config = require('../config/index.js')
var projectRoot = path.resolve(__dirname, '../');


module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath:process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, './node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'components': path.resolve(__dirname, '../src/components'),
            'assets': path.resolve(__dirname, '../src/assets')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    // name: utils.assetsPath('img/[name].[hash:7].[ext]')
                    name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                    name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    // stylus: {
    //     use: [nib()],
    //     import: ['~nib/lib/nib/index.styl'],
    //     "include css": true
    // },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },

    plugins: [
        // webpack 1.x
        // new webpack.optimize.OccurenceOrderPlugin(),
        // webpack 2.0
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.SourceMapDevToolPlugin(),
        // new ExtractTextPlugin("[name].css"),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function(module, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         )
        //     }
        // }),
        // new WriteFilePlugin()
    ]
};
