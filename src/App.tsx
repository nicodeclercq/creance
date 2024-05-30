import { I18nProvider } from "./i18nProvider";
import { Theme } from "./shared/theme/theme";
import "./App.css";
import { Router } from "./router";
import { Connection, StoreProvider } from "./StoreProvider";
import * as LocalStorage from "./services/LocalStorageService";
import { Store } from "./services/StoreService";

const connections: Connection[] = [LocalStorage];

const load = () => LocalStorage.getState();

function App() {
  return (
    <StoreProvider store={Store} load={load} connections={connections}>
      <I18nProvider>
        <Theme>
          <Router />
        </Theme>
      </I18nProvider>
    </StoreProvider>
  );
}

export default App;
