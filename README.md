# Vite와 CRA 없이 개발 환경 구축하기

## 🎯 시작하기

> Create React App(CRA)은 설정을 자동화하여 간편하게 시작할 수 있게 도와주지만, 커스터마이징에 한계가 있어 실무에서 불편할 수 있습니다. 이러한 제약을 극복하고 더 유연한 개발 환경을 만들기 위해, 직접 번들러와 트랜스파일러를 설정하여 React 프로젝트를 구축해보는 방법을 알아보겠습니다.

## 🔍 진행 방식

1. React 앱의 기본 구조 설정
2. Babel을 사용한 JSX 문법 변환
3. Webpack을 통한 번들링 설정
4. 개발 환경 최적화 및 플러그인 활용

## 🚀 문제와 해결 과정

### 1. HTML 파일을 생성하고 React 컴포넌트 작성하기

> React 애플리케이션을 만들면서 ReactDOM의 메소드를 사용하여 컴포넌트를 렌더링하려고 했는데, ReactDOM 라이브러리를 아직 불러오지 않았네요

```html
<div id="root"></div>
<script>
  const App = () => {
    return (
      <>
        <h1>Hello, React!</h1>
      </>
    );
  };
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
</script>
```

### 2. React + React DOM CDN 추가하기

> 하지만 라이브 서버를 실행해보니 `Uncaught SyntaxError: Unexpected token '<'`라는 에러가 발생했습니다. 이 문제는 스크립트에 작성한 부분이 JSX 문법을 사용하고 있기 때문인데, 브라우저는 기본적으로 자바스크립트만 해석할 수 있습니다. JSX는 브라우저가 직접 읽을 수 없는 문법이므로, 이 문제를 해결하기 위해서는 JSX를 자바스크립트로 변환하는 도구가 필요할 것 같습니다!

```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

### 3. 스크립트를 Vanilla JS 문법으로 변경하기

> 이제서야 문제가 해결되어 코드가 제대로 작동하네요! 그런데 JSX를 사용하면 코드 작성이 훨씬 더 편리할 것 같은데, 이를 위해서는 어떻게 해야 할까요? JSX를 직접 브라우저에서 사용할 수 없기 때문에, Babel과 같은 도구를 사용하여 JSX를 자바스크립트로 변환하는 방법을 적용해볼까요?

```html
<script>
  const App = () => {
    return React.createElement("h1", null, "Hello, React!");
  };
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
</script>
```

### 4. Babel 설치하기

> Babel과 같은 트랜스파일러를 사용하면 JSX와 같은 최신 문법을 JavaScript로 변환할 수 있습니다. 하지만 브라우저에서 Babel을 사용하다 보니 `You are using the in-browser Babel transformer. Be sure to precompile your scripts for production - https://babeljs.io/docs/setup/`라고 경고가 발생하네요! 이 경고는 브라우저에서 직접 트랜스파일하지 말고, 미리 컴파일하여 배포하라는 의미네요

다음은 브라우저에서 Babel을 사용하는 예시입니다:

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
  const App = () => {
    return <h1>Hello, React!</h1>;
  };
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
</script>
```

### 5. .gitignore 설정하기

```
node_modules/
dist/
.env*
```

### 6. 패키지를 설치하여 빌드 시 Babel을 실행

> babel/preset-react : React용 바벨 문법 변환 패키지

```bash
npm init -y
npm install --save-dev @babel/core @babel/cli @babel/preset-react
```

```json
// .babelrc
{
  "presets": ["@babel/preset-react"]
}
```

### 7. 스크립트 파일을 src 폴더로 이동

```html
<script type="text/babel" src="./src/app.js"></script>
```

### 8. package.json에 Babel 빌드 스크립트 추가

> 이제 빌드한 파일을 HTML 스크립트에서 불러와서 사용하면 되겠네요. 아, 그리고 이제 Babel을 CDN으로 불러올 필요는 없겠군요.

```json
// package.json
"scripts": {
    "build": "babel src -d dist"
 },
```

```html
<script src="./dist/app.js"></script>
```

### 9. Webpack과 관련된 패키지 설치하기

> 브라우저는 한 번에 6개의 네트워크 요청만 처리할 수 있습니다. 파일이 많으면 그만큼 로드가 지연될 수 있겠죠? 고객 입장에서는 하나의 파일로 받아서 빠르게 로드하고 파싱하는 것이 좋지 않을까요?

> 이 문제를 해결할 수 있는 도구가 바로 `Webpack`입니다. `Webpack`을 사용하여 여러 개의 파일을 하나로 묶어줍니다.

다음 명령어를 실행하여 Webpack과 관련된 패키지를 설치해봅시다:

```bash
npm install --save-dev webpack webpack-cli babel-loader
```

### 10. Webpack 설정하기

> Webpack의 `mode` 설정은 왜 필요한 걸까요?
> production 모드를 사용하면 코드가 최적화되어 실행 속도가 빨라지지만, 빌드 시간이 더 길어질 수 있습니다. 최적화 과정에서 함수의 결과값이 정적 값으로 계산되어 코드의 크기가 줄어들고, 빠른 파싱이 가능해집니다. 반면, development 모드를 사용하면 코드가 최적화되지 않아 빌드 시간은 짧아지지만 디버깅이 용이합니다. 따라서 개발 시점에서는 development 모드를 사용하는 것이 좋습니다.

```js
//webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
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
```

### 11. 빌드를 Webpack으로 수행하도록 수정

```json
// package.json
"scripts": {
    "build": "webpack"
 },
```

```html
<script src="dist/bundle.js" type="module"></script>
```

### 12. 번들 파일에 해시값 추가하기

> 이제 빌드와 번들링을 완료했지만, 새로 빌드한 bundle.js 파일이 브라우저에서 여전히 304 상태 코드로 캐시된 데이터를 사용하고 있습니다. 매번 캐시를 수동으로 비워야 하는 것은 불편하죠

> 이 문제를 해결하는 방법 중 하나는 `캐시 무효화(Cache Busting)` 입니다. 파일 이름에 해시값을 추가하여 파일이 변경될 때마다 새로운 파일로 인식되도록 할 수 있습니다.

```js
// webpack.config.js
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js'
}
```

### 13. `html-webpack-plugin` 패키지 추가하기

> 빌드할 때마다 생성된 해시값을 수동으로 HTML 파일에 업데이트하는 것은 매우 번거롭습니다. 이를 자동으로 처리할 수 있는 플러그인을 사용해보죠

```bash
npm install --save-dev html-webpack-plugin
```

```js
// webpack.config
const HtmlWebpackPlugin = require("html-webpack-plugin");

mode: "development";
plugins: [
  new HtmlWebpackPlugin({
    template: "index.html", // 템플릿 HTML 파일
    filename: "index.html", // 출력할 HTML 파일 이름
  }),
];
```

### 14. 빌드 시 이전 번들 파일 자동 삭제하는 플러그인 적용

> 매번 빌드할 때마다 이전 번들 파일이 dist 폴더에 남아 있어서 파일이 쌓이거나 충돌할 수 있습니다. 이를 방지하기 위해, 빌드 시 자동으로 이전 파일을 삭제하는 플러그인을 사용할 수 있습니다

```bash
npm install --save-dev clean-webpack-plugin
```

```js
// webpack.config
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

 plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
    }),
  ],
```

### 15. 개발 서버 설정하여 코드 변경 사항을 실시간으로 반영하기

> 매번 코드 변경 후 `npm run build` 명령어를 실행하는 것은 번거롭습니다. 코드 저장 시 자동으로 변경 사항을 반영해 주면 개발이 훨씬 수월하겠죠? 개발 서버를 설정하여 이 문제를 해결해 보겠습니다.

먼저, webpack-dev-server 패키지를 설치합니다:

```bash
npm install --save-dev webpack-dev-server
```

그 다음, Webpack 설정 파일(webpack.config.js)을 수정하여 개발 서버를 설정합니다:

```js
// webpack.config.js
mode: 'development', // 개발 모드
devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000, // 포트 번호
    open: true, // 서버 시작 시 브라우저 자동 열기
    hot: true, // 실시간 반영
  },
```

### 16. 프로덕션과 개발 환경에 맞게 환경 변수 설정하기

> 실제 현업에서는 개발 서버와 배포 서버를 구분하여 관리합니다. 이를 효율적으로 처리하려면 환경에 따라 다른 설정을 적용할 수 있는 방법이 필요합니다. 환경 변수를 사용하여 개발과 프로덕션 환경을 분기 처리해보겠습니다

먼저, dotenv-webpack 패키지를 설치합니다:

```bash
npm install --save-dev dotenv-webpack
```

그 다음, Webpack 설정 파일(webpack.config.js)을 수정하여 환경 변수를 설정합니다:

```js
// webpack.config.js
const DotenvWebpackPlugin = require("dotenv-webpack");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
    }),
    new DotenvWebpackPlugin({
      path: `./.env.${mode}`, // 환경에 따라 적절한 .env 로드
    }),
  ],
};
```

그리고 package.json 파일의 스크립트를 수정하여 환경 변수를 설정합니다:

```json
//package.json
"scripts": {
    "build": "webpack",
    "start": "NODE_ENV=production webpack serve"
  },
```

### 17. 크로스 플랫폼 환경 변수 설정하기

> 이전에는 개발 환경에 따라 script를 직접 조정하여 production이나 development로 변경할 수 있었습니다. 그러나 이 방법은 맥에서는 잘 작동하지만, 윈도우에서는 환경 변수 설정 방식이 다를 수 있습니다. 이를 해결하기 위해 다양한 운영 체제에서 환경 변수를 일관되게 설정할 수 있는 방법을 알아보겠습니다

cross-env 패키지를 사용하면 환경 변수를 플랫폼에 관계없이 일관되게 설정할 수 있습니다. 먼저, cross-env 패키지를 설치합니다:

```bash
npm install --save-dev cross-env
```

그 다음, package.json 파일의 스크립트를 수정하여 cross-env를 사용하여 환경 변수를 설정합니다:

```json
//package.json
 "start": "cross-env NODE_ENV=development webpack serve"
```
