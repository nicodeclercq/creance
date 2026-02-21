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
            isPublic = false,
          }: RouteDefinition) => (
            <Route
              key={path}
              path={path}
              element={
                isPublic ? (
                  <Component />
                ) : (
                  <PrivatePage>
                    <Component />
                  </PrivatePage>
                )
              }
            />
          ),
        )}
      </Routes>
    </BrowserRouter>
  );
}
