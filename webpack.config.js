
var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: '#source-map',
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'src/build.js'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|es6).js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(gif|jpg|png|html)\??.*$/,
                loader: 'url-loader?limit=1&name=[path][name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'three' : path.resolve(__dirname, 'dep/three.84.min.js'),
            'three-lib': path.join(__dirname, 'dep/three-lib'),
            'react': path.resolve(__dirname, 'dep/react.15.3.1.min.js'),
            'react-dom': path.resolve(__dirname, 'dep/react-dom.15.3.1.min.js'),
            'fcui2': path.join(__dirname, 'dep/fcui2/src'),
            'raphael': path.join(__dirname, 'dep/raphael.2.2.1.min.js'),
            'file-system': path.join(__dirname, 'dep/filesystem.0.0.2'),
            'FileSaver': path.join(__dirname, 'dep/FileSaver.1.3.3.min'),
            'jszip': path.join(__dirname, 'dep/jszip.3.1.3.min'),
            'underscore': path.join(__dirname, 'dep/underscore.1.8.5')
        }
    }
};