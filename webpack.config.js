const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const outputPath = path.resolve(__dirname, "dist/logs");

module.exports = {
  mode: "production",
  entry: "./src/server.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    filename: "server.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "dist")],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: path.resolve(__dirname, "dist", "assets") },
        { from: "src/config.json", to: path.resolve(__dirname, "dist") },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("CreateEmptyDirectory", () => {
          if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
          }
        });
      },
    },
  ],
};
