import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./components/app";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
