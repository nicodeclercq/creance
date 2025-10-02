import "./App.css";

import { I18nProvider } from "react-aria";
import { Router } from "./router";
import { StoreProvider } from "./store/StoreProvider";

function App() {
  return (
    <I18nProvider locale="fr-FR">
      <StoreProvider>
        <Router />
      </StoreProvider>
    </I18nProvider>
  );
}

export default App;
