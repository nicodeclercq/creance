import "./App.css";

import {
  StoreProvider,
  load,
  onChange,
} from "./store/StoreProvider";

import { Debug } from "./ui/Debug/Debug";
import { I18nProvider } from "react-aria";
import { Router } from "./router";
// import { synchronizeFirebase } from "./service/firebase";
import { synchronizeLocalStorage } from "./store/localStorage";

// Synchronize local storage with the store
synchronizeLocalStorage({ load, onChange });
// synchronizeFirebase({ $store, update });

function App() {
  return (
    <I18nProvider locale="fr-FR">
      <StoreProvider>
        <Router />
        <Debug />
      </StoreProvider>
    </I18nProvider>
  );
}

export default App;
