import "./App.css";

import { DialogStackHook } from "./ui/DialogProvider/DialogStackHook";
import { I18nProvider } from "react-aria";
import { LoadingPage } from "./pages/loading/LoadingPage";
import { Router } from "./router";
import { StoreProvider } from "./store/StoreProvider";

function App() {
  return (
    <I18nProvider locale="fr-FR">
      <StoreProvider loadingRenderer={LoadingPage}>
        <Router />
        <DialogStackHook />
      </StoreProvider>
    </I18nProvider>
  );
}

export default App;
