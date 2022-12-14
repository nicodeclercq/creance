import React from 'react';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import * as Record from 'fp-ts/Record';
import { ThemeProvider } from './theme/themeProvider';
import { ROUTE, RouteName } from './router';
import { Login } from './pages/auth/login';

export const ROUTE_COMPONENTS: Record<RouteName, JSX.Element> = {
  HOME: <Login />,
};

const router = createBrowserRouter(
  Record
    .toEntries(ROUTE_COMPONENTS)
    .map(([name, component]) => ({
      path: ROUTE[name],
      element: component
    }))
);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
