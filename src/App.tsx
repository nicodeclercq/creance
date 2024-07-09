import { I18nProvider } from "./i18nProvider";
import { Theme } from "./shared/theme/theme";
import "./App.css";
import { Router } from "./router";
import { Connection, StoreProvider } from "./StoreProvider";
import * as LocalStorage from "./services/LocalStorageService";
import * as Supabase from "./services/SupabaseService";
import { Store } from "./services/StoreService";
import { Authenticated } from "./pages/auth/Authenticated";

const connections: Connection[] = [LocalStorage, Supabase];

const load = () => LocalStorage.getState();

function App() {
  return (
    <Authenticated>
      <StoreProvider store={Store} load={load} connections={connections}>
        <I18nProvider>
          <Theme>
            <Router />
          </Theme>
        </I18nProvider>
      </StoreProvider>
    </Authenticated>
  );
}

export default App;
