import { I18nProvider } from "./i18nProvider";
import { Theme } from "./shared/theme/theme";
import "./App.css";
import { Router } from "./router";
import { Connection, StoreProvider } from "./StoreProvider";
import * as LocalStorage from "./services/LocalStorageService";
import { Store } from "./services/StoreService";
import { Authenticated } from "./pages/auth/Authenticated";
import { useEffect } from "react";
import * as SupabaseService from "./services/SupabaseService";
import { getCustomCss } from "./entities/css";

const connections: Connection[] = [LocalStorage];

const load = () => LocalStorage.getState();

function App() {
  useEffect(() => {
    SupabaseService.getAllCreances().then((creances) => {
      // console.log("retrieved", creances);
    });
  }, []);

  useEffect(() => {
    document.getElementById("custom-css")?.remove();
    const style = document.createElement("style");
    style.id = "custom-css";
    style.innerHTML = getCustomCss();
    document.head.appendChild(style);
  }, []);

  return (
    <I18nProvider>
      <Authenticated>
        <StoreProvider store={Store} load={load} connections={connections}>
          <Theme>
            <Router />
          </Theme>
        </StoreProvider>
      </Authenticated>
    </I18nProvider>
  );
}

export default App;
