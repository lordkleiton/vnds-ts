const path = require("path");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "production",
  plugins: [new CompressionPlugin(), new Dotenv()],
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
