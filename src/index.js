import React from "react";
import ReactDOM from "react-dom";
import bootstrap from "bootstrap"; // eslint-disable-line no-unused-vars
import CustomProperties from 'react-custom-properties';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Banner from "./visualizer/Banner";
import Visualizer from "./visualizer/Visualizer";

import "./styles.css";

function App() {
  return (
    <div className="app height-full">
      <Banner />
      <Visualizer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
