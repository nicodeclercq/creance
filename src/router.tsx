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
