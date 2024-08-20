import add from "./add.js";
import sub from "./sub.js";
import mul from "./mul.js";

const App = () => {
  const sum = add(2, 3);
  const diff = sub(2, 3);
  const product = mul(2, 3);
  return (
    <h1>
      {sum}, {diff}, {product}
    </h1>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
