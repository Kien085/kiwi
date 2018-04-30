import React from "react";
import ReactDOM from "react-dom";
import PeterTest from "./PeterTest.jsx";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<PeterTest color="red" times="3"/>, document.getElementById("root"));
registerServiceWorker();