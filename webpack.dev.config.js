
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DATASET = require('./webpack.dataset');

module.exports = {
    devtool: '#source-map',
    entry: {
        'js/dep/three': ['three'],
        'js/dep/other': [
            'raphael',
            'file-system',
            'FileSaver',
            'jszip',
            'underscore'
        ],
        'js/app': './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
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
        new ExtractTextPlugin('css/style.css'),
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