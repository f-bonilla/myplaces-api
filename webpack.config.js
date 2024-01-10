const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/config.json", to: "config.json" },
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
