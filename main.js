// vdom -> 用js去描述真实dom的一个结构

import ReactDom from "./core/ReactDom.js";
import React from "./core/React.js";

const App = React.createElement("div", { id: "app" }, "app", "hi");

ReactDom.createRoot(document.getElementById("root")).render(App);
