var path = require('path');
var nib = require('nib');
var webpack = require('webpack');
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
                    name: utils.assetsPath('img/[name].[hash:5].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:5].[ext]')
                }
            }
        ]
    },
    stylus: {
        use: [nib()],
        import: ['~nib/lib/nib/index.styl'],
        "include css": true
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },

    plugins: [
        // webpack 1.x
        // new webpack.optimize.OccurenceOrderPlugin(),
        // webpack 2.0
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
        // new webpack.HotModuleReplacementPlugin(),
    ]
};
