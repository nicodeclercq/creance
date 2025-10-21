import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PrivatePage } from "./PrivatePage";
import type { Route as RouteDefinition } from "./routes";
import { routes } from "./routes";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(
          ({
            path,
            component: Component,
            isPrivate = false,
          }: RouteDefinition) => (
            <Route
              key={path}
              path={path}
              element={
                isPrivate ? (
                  <PrivatePage>
                    <Component />
                  </PrivatePage>
                ) : (
                  <Component />
                )
              }
            />
          )
        )}
      </Routes>
    </BrowserRouter>
  );
}
