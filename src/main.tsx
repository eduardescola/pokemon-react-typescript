// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importamos BrowserRouter
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter> {/* Aquí envolvemos App con BrowserRouter */}
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("❌ No se encontró el elemento con id='root'.");
}
