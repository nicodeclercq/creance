import "./App.css";

import { StoreProvider, load, onChange } from "./store/StoreProvider";

import { I18nProvider } from "react-aria";
import { Router } from "./router";
import { synchronizeLocalStorage } from "./store/localStorage";

// Synchronize local storage with the store
synchronizeLocalStorage({ load, onChange });

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
