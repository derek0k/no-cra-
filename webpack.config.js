const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash.js",
  },
  module: {
    rules: [
      //.css, .js 등 다양한 파일 확장자를 처리할 규칙 정의
      {
        test: /\.js$/, // 어떤 파일을 대상으로 할지 정규표현식으로 작성
        exclude: /node_modules/, // node_modules 폴더는 제외
        use: {
          loader: "babel-loader", // babel-loader를 사용하여 ES6+ 코드를 변환
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html", // 템플릿 HTML 파일
      filename: "index.html", // 출력할 HTML 파일 이름
    }),
    new DotenvWebpackPlugin({
      path: `./.env.${mode}`,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    open: true,
    hot: true,
  },
  mode: "development", // 없으면 warning 이 남
};
