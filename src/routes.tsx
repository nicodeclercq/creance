import { type ReactNode } from "react";
import { redirect } from "react-router-dom";
import { EventsPage } from "./pages/events/EventsPage";
import { Redirect } from "./Redirect";
import { AddEventPage } from "./pages/events/AddEventPage";
import { EventPage } from "./pages/event/EventPage";
import { AddTransactionPage } from "./pages/event/AddTransactionPage";
import { EditTransactionPage } from "./pages/event/EditTransactionPage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { EventUsersPage } from "./pages/participants/EventUsersPage";
import { ParticipantSharePage } from "./pages/shares/ParticipantSharePage";
import { EventParticipantSharePage } from "./pages/participants/EventParticipantSharePage";
import { DistributionPage } from "./pages/distribution/DistributionPage";
import { ValueOf } from "./utils/object";
import { LoginPage } from "./pages/auth/LoginPage";
import { InformationPage } from "./pages/settings/InformationPage";
import { CalendarPage } from "./pages/calendar/CalendarPage";

export const ROUTES_DEFINITION = {
  ROOT: {
    path: "/",
    component: () => <Redirect to="EVENT_LIST" />,
  },
  LOGIN: {
    path: "/login",
    component: LoginPage,
  },
  INFORMATION: {
    path: "/information",
    component: InformationPage,
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
  EVENT_CALENDAR: {
    path: "/events/:eventId/calendar",
    component: CalendarPage,
  },
  TRANSACTION_ADD: {
    path: "/events/:eventId/transactions/add",
    component: AddTransactionPage,
  },
  TRANSACTION_EDIT: {
    path: "/events/:eventId/transactions/:transactionId/edit",
    component: EditTransactionPage,
  },
  CATEGORIES_EDIT: {
    path: "/events/:eventId/categories/edit",
    component: CategoriesPage,
  },
  EVENT_USERS: {
    path: "/events/:eventId/users",
    component: EventUsersPage,
  },
  EVENT_USERS_EDIT: {
    path: "/events/:eventId/users/:participantId/edit",
    component: ParticipantSharePage,
  },
  EVENT_PARTICIPANT_SHARE: {
    path: "/events/:eventId/participantshare",
    component: EventParticipantSharePage,
  },
  EVENT_DISTRIBUTION: {
    path: "/events/:eventId/distribution",
    component: DistributionPage,
  },
  JOIN: {
    path: "/join/:eventId/:shareId",
    component: () => <h1>Join event</h1>,
  },
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
  isPrivate?: boolean;
};

export const routes = Object.values(ROUTES_DEFINITION) as LeafRoute[];

export type Route = LeafRoute;
export type RouteName = keyof typeof ROUTES_DEFINITION;

type RoutePath<R extends RouteName> = (typeof ROUTES_DEFINITION)[R]["path"];

type ParamsFromString<R extends string> =
  R extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? {
        [K in Param]: string;
      } & ParamsFromString<`/${Rest}`>
    : R extends `${infer _Start}:${infer Param}`
    ? {
        [K in Param]: string;
      }
    : {};

export type Params<R extends RouteName> = {} extends ParamsFromString<
  RoutePath<R>
>
  ? undefined
  : ParamsFromString<RoutePath<R>>;

export const isLeafRoute = (route: Route): route is LeafRoute =>
  "component" in route;

export const getRouteDefinition = (route: RouteName) =>
  ROUTES_DEFINITION[route];

export const getPath = (
  route: RouteName,
  parameters?: { [key: string]: string | number },
  hash?: string
) => {
  if (!(route in ROUTES_DEFINITION)) {
    throw new Error(`Route ${route} not found`);
  }

  return (parameters ? Object.entries(parameters) : []).reduce(
    (acc: string, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), `${value}`),
    `${ROUTES_DEFINITION[route].path}${hash ? `#${hash}` : ""}`
  ) as RouteName;
};

export const navigate = (
  route: RouteName,
  parameters?: { [key: string]: string }
) => {
  const path = getPath(route, parameters);
  redirect(path);
};
