// vdom -> 用js去描述真实dom的一个结构
import React from "../core/React.js";
import ReactDom from "../core/ReactDom.js";
import App from "./App.jsx";

ReactDom.createRoot(document.getElementById("root")).render(<App />);
