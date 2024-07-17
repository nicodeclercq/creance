import { I18nProvider } from "./i18nProvider";
import { Theme } from "./shared/theme/theme";
import "./App.css";
import { Router } from "./router";
import { StoreProvider } from "./StoreProvider";
import { Authenticated } from "./pages/auth/Authenticated";
import { useEffect } from "react";
import { getCustomCss } from "./entities/css";

function App() {
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
        <StoreProvider>
          <Theme>
            <Router />
          </Theme>
        </StoreProvider>
      </Authenticated>
    </I18nProvider>
  );
}

export default App;
