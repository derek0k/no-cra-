# Vite와 CRA 없이 개발 환경 구축하기

## 🎯 시작하기

> Create React App(CRA)은 설정을 자동화하여 간편하게 시작할 수 있게 도와주지만, 커스터마이징에 한계가 있어 실무에서 불편할 수 있습니다. 이러한 제약을 극복하고 더 유연한 개발 환경을 만들기 위해, 직접 번들러와 트랜스파일러를 설정하여 React 프로젝트를 구축해보는 방법을 알아보겠습니다.

## 🔍 진행 방식

1. React 앱의 기본 구조 설정
2. Babel을 사용한 JSX 문법 변환
3. Webpack을 통한 번들링 설정
4. 개발 환경 최적화 및 플러그인 활용

## 🚀 문제와 해결 과정

### 1. HTML 파일을 생성하고 기존의 React 컴포넌트처럼 내용을 작성해보자.

> ReactDOM의 메소드를 사용하려고 했는데, 아직 가져오지 않았네!

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

> 그런데 라이브 서버로 가보니까 `Uncaught SyntaxError: Unexpected token '<'`라는 에러가 발생하네요. 아.. 스크립트에 작성한 부분은 JSX 문법인데 브라우저가 JS만 읽을 수 있어서 문제가 생긴 거구나.

```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

### 3. 스크립트를 Vanilla JS 문법으로 변경하기

> 이제서야 문제없이 작동하네! 그런데 JSX를 사용하면 코드 작성이 더 편할 것 같은데, 방법이 없을까?

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

```json
// package.json
"scripts": {
    "build": "babel src -d dist"
 },
```
