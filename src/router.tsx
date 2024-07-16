import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes, Route as RouteDefinition } from "./routes";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component: Component }: RouteDefinition) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
