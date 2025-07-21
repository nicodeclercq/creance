import "./App.css";

import {
  $store,
  StoreProvider,
  get,
  load,
  onChange,
  update,
} from "./store/StoreProvider";
import { listenToAuthChanges, synchronizeFirebase } from "./service/firebase";

import { I18nProvider } from "react-aria";
import { Router } from "./router";
import { synchronizeLocalStorage } from "./store/localStorage";

// Synchronize local storage with the store
synchronizeLocalStorage({ load, onChange });
// Synchronize Firebase with the store
listenToAuthChanges();
synchronizeFirebase({ $store, update, get });

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
