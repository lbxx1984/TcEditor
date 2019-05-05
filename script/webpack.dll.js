/**
 * @file dll.config.js
 * @author Brian Li
 */
const path = require('path');
const webpack = require('webpack');
const getAbsPath = dist => path.resolve(__dirname, `../${dist}`);

module.exports = {
    mode: 'development',
    entry: {
        vendor: [
            'react',
            'react-dom',
            'prop-types',
            'three',
            'raphael',
            'FileSystem',
            'FileSaver'
        ]
    },
    output: {
        filename: '[name].dll.js',
        library: '[name]'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            raphael: getAbsPath('dep/raphael.2.2.1.min'),
            FileSystem: getAbsPath('dep/filesystem.0.0.2'),
            FileSaver: getAbsPath('dep/FileSaver.1.3.3.min')
        }
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
