const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js";

module.exports = {
    plugins: [new MiniCssExtractPlugin({ filename: "css/styles.css" })],
    entry: {
        main: BASE_JS + "/main.js",
        videoPlayer: BASE_JS + "/videoPlayer.js",
        recorder: BASE_JS + "/recorder.js",
        commentSection: "./src/client/js/commentSection.js"
    },
    watch: true,
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
}
