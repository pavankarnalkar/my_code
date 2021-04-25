import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import dotenv from "dotenv";
dotenv.config();
// function index() {
//   return <div></div>;
// }

ReactDom.render(<App />, document.getElementById("root"));
