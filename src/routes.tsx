import { type ReactNode } from "react";
import { redirect } from "react-router-dom";
import { EventsPage } from "./pages/events/EventsPage";
import { Redirect } from "./Redirect";
import { IconsPage } from "./pages/IconsPage";
import { AddEventPage } from "./pages/events/AddEventPage";
import { EventPage } from "./pages/event/EventPage";
import { AddExpensePage } from "./pages/event/AddExpensePage";
import { EditExpensePage } from "./pages/event/EditExpensePage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { SharesPage } from "./pages/shares/SharesPage";
import { UserSharePage } from "./pages/shares/UserSharePage";
import { EventUserSharePage } from "./pages/shares/EventUserSharePage";
import { DistributionPage } from "./pages/distribution/DistributionPage";
import { ValueOf } from "./utils/object";
import { LoginPage } from "./pages/auth/LoginPage";
import { InformationPage } from "./pages/settings/InformationPage";
import { AddDepositPage } from "./pages/deposits/AddDepositPage";
import { EditDepositPage } from "./pages/deposits/EditDepositPage";

export const ROUTES_DEFINITION = {
  ROOT: {
    path: "/",
    component: () => <Redirect to="EVENT_LIST" />,
  },
  LOGIN: {
    path: "/login",
    component: LoginPage,
    isPublic: true,
  },
  INFORMATION: {
    path: "/information",
    component: InformationPage,
    isPublic: true,
  },
  EVENT_LIST: {
    path: "/events",
    component: EventsPage,
  },
  EVENT_ADD: {
    path: "/events/add",
    component: AddEventPage,
  },
  EVENT: {
    path: "/events/:eventId/expenses",
    component: EventPage,
  },
  EXPENSE_ADD: {
    path: "/events/:eventId/expenses/add",
    component: AddExpensePage,
  },
  EXPENSE_EDIT: {
    path: "/events/:eventId/expenses/:expenseId/edit",
    component: EditExpensePage,
  },
  CATEGORIES_EDIT: {
    path: "/events/:eventId/categories/edit",
    component: CategoriesPage,
  },
  DEPOSIT_ADD: {
    path: "/events/:eventId/deposits/add",
    component: AddDepositPage,
  },
  DEPOSIT_EDIT: {
    path: "/events/:eventId/deposits/:depositId/edit",
    component: EditDepositPage,
  },
  SHARES: {
    path: "/events/:eventId/shares",
    component: SharesPage,
  },
  SHARES_EDIT: {
    path: "/events/:eventId/shares/:shareId/edit",
    component: UserSharePage,
  },
  EVENT_USER_SHARE: {
    path: "/events/:eventId/usershare",
    component: EventUserSharePage,
  },
  EVENT_DISTRIBUTION: {
    path: "/events/:eventId/distribution",
    component: DistributionPage,
  },
  JOIN: {
    path: "/join/:eventId/:shareId",
    component: () => <h1>Join event</h1>,
  },
  // TECH
  ICONS: {
    path: "/icons",
    component: IconsPage,
  },
  /*
  CREANCE_ADD: "/creances/add",
  CREANCE_VIEW: "/creances/:creanceId",
  CREANCE_EDIT: "/creances/:creanceId/edit",
  EXPENSE_LIST: "/creances/:creanceId/expenses",
  EXPENSE_ADD: "/creances/:creanceId/expenses/add",
  EXPENSE_VIEW: "/creances/:creanceId/expenses/:id",
  EXPENSE_EDIT: "/creances/:creanceId/expenses/:id/edit",
  DISTRIBUTION: "/creances/:creanceId/distribution",
  RESULTS: "/creances/:creanceId/summary",
  USER_LIST: "/creances/:creanceId/users",
  CATEGORIES_LIST: "/creances/:creanceId/categories",
  EXPORT: "/creances/:creanceId/export",
  */
} as const satisfies Record<
  string,
  {
    path: string;
    component: () => ReactNode;
    isPublic?: boolean;
  }
>;

export const ROUTES = Object.keys(ROUTES_DEFINITION).reduce(
  (acc, cur) => ({ ...acc, [cur]: cur }),
  {}
) as { [k in RouteName]: k };

export const DEFAULT_ROUTE: RouteName = ROUTES.ROOT;

export type LeafRoute = {
  path: ValueOf<typeof ROUTES_DEFINITION>["path"];
  component: () => ReactNode;
  isPublic?: boolean;
};

export const routes = Object.values(ROUTES_DEFINITION) as LeafRoute[];

export type Route = LeafRoute;
export type RouteName = keyof typeof ROUTES_DEFINITION;

export const isLeafRoute = (route: Route): route is LeafRoute =>
  "component" in route;

export const getRouteDefinition = (route: RouteName) =>
  ROUTES_DEFINITION[route];

export const getPath = (
  route: RouteName,
  parameters?: { [key: string]: string | number }
) =>
  (parameters ? Object.entries(parameters) : []).reduce(
    (acc: string, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), `${value}`),
    ROUTES_DEFINITION[route].path
  ) as RouteName;

export const navigate = (
  route: RouteName,
  parameters?: { [key: string]: string }
) => {
  const path = getPath(route, parameters);
  redirect(path);
};
