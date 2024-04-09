import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import * as Record from "fp-ts/Record";
import { ThemeProvider } from "./theme/themeProvider";
import { ROUTE, RouteName } from "./router";
// import { Login } from "./pages/auth/login";
import { CreanceListPage } from "./pages/creance/CreanceListPage";
// import { EitherRoute } from "./components/router/EitherRoute";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { AddCreancePage } from "./pages/creance/AddCreancePage";

export const ROUTE_COMPONENTS = {
  HOME: () => <Navigate to={ROUTE["CREANCE_LIST"]} />, // <EitherRoute onUnlogged={Login} onLogged={CreanceList} />
  CREANCE_LIST: () => <CreanceListPage />,
  ADD_CREANCE: () => <AddCreancePage />,
} satisfies Record<RouteName, () => JSX.Element>;

const router = createBrowserRouter(
  Record.toEntries(ROUTE_COMPONENTS).map(([name, Component]) => ({
    path: ROUTE[name],
    element: <Component />,
  }))
);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
