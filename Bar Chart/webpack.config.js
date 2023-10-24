// https://stackoverflow.com/questions/72361260/why-webpack-doesnt-need-us-to-import-loaders-but-plugins-does
// https://youtu.be/MpGLUVbqoYQ?t=3691

const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
}