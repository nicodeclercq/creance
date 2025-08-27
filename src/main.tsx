import "./index.css";

import App from "./App";
import { I18nextProvider } from "react-i18next";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { i18n } from "./i18n";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
);
