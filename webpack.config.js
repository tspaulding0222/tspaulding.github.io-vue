// provides utilities for working with file and directory paths
var path = require("path");
// Module bundler, bundle js, css, scss for useage in browser
var webpack = require("webpack");
// Webpack loader that allows author to write single file componenets in Vue  (.vue files)
var { VueLoaderPlugin } = require("vue-loader");
// JS Minification
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// NODE.JS object
module.exports = {
    // Starting point of all our JS
    entry: "./src/main.js",
    // Set enviroment for webpack
    // Development provides features like:
        // Tooling for browser debugging
        // Detailed error message
        // Fast Incremental builds (think hot reloading)
    // Production provides features like:
        // Optimized builds (minification)
        // Small output size
        // Exclusion of development only code (console logs)
    mode: "development",
    // where to output your bundles
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "build")
    },
    // Configure how modules are resolved. 
    // For example. when calling import "tom", we can resolve where webpack goes to look for "tom"
    resolve: {
        // Create alias to use certain modules more easily
        // Instead of using import vue/dist/vue.esm.js
        // We can use import vue$
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },
    // Object that contains how each different webpack module will be treated. 
    // Think of it as the object that stores instructions for each webpack plugin
    module: {
        // Array of rules/instructions for diff file types we are using
        // test -> Types of files to transform/change/pre-process before import/load
        // loader -> Type of transformation/what webpack loader to use
        // exlude -> don't look for files to transform here
        // use -> array of loaders we want to use/chain on a single file type (executed in reverse order, bottom to top)
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {}
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-env"]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    "sass-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: "inline",
                            config: {
                                ctx: {
                                    autoprefixer: { browsers: ["last 2 versions", "iOS >= 8"] }
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: "inline",
                            config: {
                                ctx: {
                                    autoprefixer: { browsers: ["last 2 versions", "iOS >= 8"] }
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "./static/"
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "./static/img/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [new VueLoaderPlugin()],
    devtool: "eval-source-map"
};

// if this is production. 
if (process.env.NODE_ENV == "production") {
    module.exports.mode = "production";
    module.exports.devtool = "source-map";
    // First plugin. Plugins are used for anything a loader cannot do (java minification, file generation, compressing images)
    module.exports.plugins = (module.exports.plugins || []).concat([
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]);
}
