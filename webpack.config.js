const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const outputDirName = 'dist';
const isDevMode = process.env.NODE_ENV === 'development';
const isProdMode = process.env.NODE_ENV === 'production';

const getOptimisation = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProdMode) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin()
        ]
    }

    return config;
};

const getFileName = (ext) => isDevMode ? `[name].${ext}` : `[name].[hash].${ext}`;

const getCssLoaders = (additionalLoader) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDevMode,
            reloadAll: true
        }
    }, 'css-loader'];

    if (additionalLoader) {
        loaders.push(additionalLoader);
    }

    return loaders;
};

const getBabelLoaders = (additionalLoader, includeEsLint) => {
    const babelLoader = {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        }
    };
    const loaders = [];

    if (additionalLoader) {
        babelLoader.options.presets.push(additionalLoader);
    }

    loaders.push(babelLoader);

    if (isDevMode && includeEsLint) {
        loaders.push('eslint-loader');
    }

    return loaders;
};

const getPlugins = () => {
    const plugins = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProdMode
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, outputDirName)
            }
        ]),
        new MiniCssExtractPlugin({
            filename: getFileName('css')
        })
    ];

    if (isProdMode) {
        plugins.push(new BundleAnalyzerPlugin({
            analyzerPort: 4000
        }));
    }

    return plugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: [
            '@babel/polyfill',
            './index.js'
        ],
        analytics: './analytics.js',
        analyticsTyped: './analyticsTyped.ts'
    },
    output: {
        filename: getFileName('js'),
        path: path.resolve(__dirname, outputDirName)
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models':  path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: getOptimisation(),
    devServer: {
        port: 4200,
        hot: isDevMode
    },
    devtool: isDevMode ? 'source-map' : '',
    plugins: getPlugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: getCssLoaders()
            },
            {
                test: /\.less$/,
                use: getCssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getCssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: getBabelLoaders(null, true)
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: getBabelLoaders('@babel/preset-typescript')
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: getBabelLoaders('@babel/preset-react')
            }
        ]
    }
};
