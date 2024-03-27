// vdom -> 用js去描述真实dom的一个结构

import ReactDom from "../core/ReactDom.js";
import App from "./app.jsx";

ReactDom.createRoot(document.getElementById("root")).render(App);
