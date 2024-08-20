const path = require("path");

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
  mode: "development", // 없으면 warning 이 남
};
