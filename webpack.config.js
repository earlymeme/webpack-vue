/**
 * @file test
 * @author zhujianchen@baidu.com
 * @description
 * Created by zhujianchen on 16-8-25.
 */
var path = require("path");
var webpack = require('webpack');
var fs = require('fs');
var glob = require('glob');

module.exports = {
    entry: entries('views/*.js'),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        devtool: 'source-map',
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /.vue$/,
                loader: 'vue'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            filename: "commons.js",
            name: "commons"
        })
    ]
}
function entries(globPath) {
    var files = glob.sync(globPath);
    var entries = {}, entry, dirname, basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        entries[path.join(dirname, basename)] = './' + entry;
    }

    return entries;
}