import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as Record from "fp-ts/Record";
import { ThemeProvider } from "./theme/themeProvider";
import { ROUTE, RouteName } from "./router";
import { Login } from "./pages/auth/login";
import { CreanceList } from "./pages/creance/list";
import { EitherRoute } from "./components/router/EitherRoute";

export const ROUTE_COMPONENTS = {
  HOME: () => <EitherRoute onUnlogged={Login} onLogged={CreanceList} />,
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
