import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Route as RouteDefinition, routes } from "./routes";

import { PrivatePage } from "./PrivatePage";

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
          )
        )}
      </Routes>
    </BrowserRouter>
  );
}
