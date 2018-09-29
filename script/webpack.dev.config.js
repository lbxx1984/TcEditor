const nodePath = require('path');
const getAbsPath = dist => nodePath.resolve(__dirname, `../${dist}`);
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: getAbsPath('build')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader", options: {sourceMap: true}
                    },
                    {
                        loader: "less-loader", options: {sourceMap: true}
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.(gif|jpg|png|html)\??.*$/,
                use: {
                    loader: 'url-loader?limit=1&name=[path][name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'dep': getAbsPath('dep'),
            'tcui': getAbsPath('dep/tcui'),
            'tools': getAbsPath('src/tools'),
            'core': getAbsPath('src/core'),
            'raphael': getAbsPath('dep/raphael.2.2.1.min'),
            'FileSystem': getAbsPath('dep/filesystem.0.0.2'),
            'FileSaver': getAbsPath('dep/FileSaver.1.3.3.min')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: getAbsPath('index.ejs')
        })
    ]
};
