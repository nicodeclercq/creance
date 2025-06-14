import "./App.css";

import {
  $store,
  StoreProvider,
  load,
  onChange,
  update,
} from "./store/StoreProvider";

import { I18nProvider } from "react-aria";
import { Router } from "./router";
import { synchronizeFirebase } from "./service/firebase";
import { synchronizeLocalStorage } from "./store/localStorage";

// Synchronize local storage with the store
synchronizeLocalStorage({ load, onChange });
synchronizeFirebase({ $store, update });

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
