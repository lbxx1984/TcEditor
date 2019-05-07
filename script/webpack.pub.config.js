const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodePath = require('path');
const getAbsPath = dist => nodePath.resolve(__dirname, `../${dist}`);


module.exports = {
    mode: 'production',
    output: {
        path: getAbsPath('build'),
        filename: 'js/[chunkhash:8].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
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
            dep: getAbsPath('dep'),
            tcui: getAbsPath('dep/tcui'),
            tools: getAbsPath('src/tools'),
            core: getAbsPath('src/core'),
            raphael: getAbsPath('dep/raphael.2.2.1.min'),
            FileSystem: getAbsPath('dep/filesystem.0.0.2'),
            FileSaver: getAbsPath('dep/FileSaver.1.3.3.min')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: getAbsPath('index.ejs')
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[chunkhash:8].css',
            chunkFilename: 'css/[id].css'
        }),
        new CopyWebpackPlugin([
            {
                from: getAbsPath('dist/resource'),
                to: getAbsPath('build/resource')
            },
            {
                from: getAbsPath('dist/favicon.ico'),
                to: getAbsPath('build/favicon.ico')
            },
            {
                from: getAbsPath('dist/unsupport.html'),
                to: getAbsPath('build/unsupport.html')
            }
        ])
    ],
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    minChunks: 1,
                    name: 'vendor',
                    priority: -1
                },
                deps: {
                    test: /dep/,
                    minChunks: 1,
                    name: 'deps',
                    priority: -10
                },
                default: {
                    test: /[\\/]src[\\/]js[\\/]/,
                    minChunks: 2,
                    name: 'main',
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
