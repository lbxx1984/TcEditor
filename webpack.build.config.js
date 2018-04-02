
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DATASET = require('./webpack.dataset');
const TIME_STAMP = new Date().getTime();

module.exports = {
    entry: {
        'js/dep/three': ['three'],
        'js/dep/other': [
            'raphael',
            'FileSystem',
            'FileSaver',
            'jszip'
        ],
        'js/app': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].' + TIME_STAMP + '.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: DATASET['babel-exclude']
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.(gif|jpg|png|html)\??.*$/,
                loader: 'url-loader?limit=1&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['js/dep/other', 'js/dep/three']
        }),
        new ExtractTextPlugin('css/style.' + TIME_STAMP + '.css'),
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'index.ejs'),
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: DATASET['resolve-alias']
    }
};