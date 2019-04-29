/**
 * @file dll.config.js
 * @author Brian Li
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        vendor: [
            'react',
            'react-dom',
            'prop-types',
            'three'
        ]
    },
    output: {
        filename: '[name].dll.js',
        library: '[name]'
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {}
        }),
        new webpack.DllPlugin({
            path: path.resolve('dist/', 'manifest.dll.dev.json'),
            name: '[name]'
        })
    ]
};
