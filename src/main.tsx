import "./index.css";

import App from "./App";
import { I18nextProvider } from "react-i18next";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { i18n } from "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
);
