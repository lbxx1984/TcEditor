

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TIME_STAMP = new Date().getTime();

module.exports = {
    entry: {
        'js/dep/three': ['three'],
        'js/dep/react': ['react', 'react-dom'],
        'js/dep/other': [
            'raphael',
            'file-system',
            'FileSaver',
            'jszip',
            'underscore'
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
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname, 'dep/three.84.min'),
                    path.resolve(__dirname, 'dep/react.15.3.1.min'),
                    path.resolve(__dirname, 'dep/react-dom.15.3.1.min'),
                    path.resolve(__dirname, 'dep/raphael.2.2.1.min'),
                    path.resolve(__dirname, 'dep/FileSaver.1.3.3.min'),
                    path.resolve(__dirname, 'dep/jszip.3.1.3.min')
                ]
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
            names: ['js/dep/other', 'js/dep/react', 'js/dep/three']
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
        extensions: ['.js'],
        alias: {
            'three' : path.resolve(__dirname, 'dep/three.84.min'),
            'three-lib': path.resolve(__dirname, 'dep/three-lib'),
            'react': path.resolve(__dirname, 'dep/react.15.3.1.min'),
            'react-dom': path.resolve(__dirname, 'dep/react-dom.15.3.1.min'),
            'fcui2': path.resolve(__dirname, 'dep/fcui2/src'),
            'raphael': path.resolve(__dirname, 'dep/raphael.2.2.1.min'),
            'file-system': path.resolve(__dirname, 'dep/filesystem.0.0.2'),
            'FileSaver': path.resolve(__dirname, 'dep/FileSaver.1.3.3.min'),
            'jszip': path.resolve(__dirname, 'dep/jszip.3.1.3.min'),
            'underscore': path.resolve(__dirname, 'dep/underscore.1.8.5')
        }
    }
};