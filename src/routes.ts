import { UID } from "./@types/uid.d";
import { ValueOf } from "./ValueOf.d";
import { ComponentLibrary } from "./pages/components-library/components-libary";
import { ExpenseList } from "./pages/expense/list/expenses-list";
import { AddExpense } from "./pages/expense/add/expenses-add";
import { EditExpense } from "./pages/expense/edit/expenses-edit";
import { Distribution } from "./pages/distribution/distribution";
import { Results } from "./pages/results/results";
import { CategoryList } from "./pages/category/list/category-list";
import { UserList } from "./pages/user/list/user-list";
import { CreanceList } from "./pages/creance-list/creance-list";
import { AddCreance } from "./pages/creance-list/add/creances-add";
import { EditCreance } from "./pages/creance-list/edit/creances-edit";
import { Export } from "./pages/export/export";

const ROUTES_DEFINITION = {
  ROOT: "/",
  COMPONENTS_LIBRARY: "/__lib",
  CREANCE_LIST: "/creances",
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
} as const;

export const ROUTES = Object.keys(ROUTES_DEFINITION).reduce(
  (acc, cur) => ({ ...acc, [cur]: cur }),
  {}
) as { [k in RouteName]: k };

export const DEFAULT_ROUTE: RouteName = ROUTES.EXPENSE_LIST;

export type LeafRoute = {
  path: ValueOf<typeof ROUTES_DEFINITION>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (...arg: any[]) => JSX.Element;
};

export const routes: LeafRoute[] = [
  {
    path: ROUTES_DEFINITION.COMPONENTS_LIBRARY,
    component: ComponentLibrary,
  },
  {
    path: ROUTES_DEFINITION.CREANCE_LIST,
    component: CreanceList,
  },
  {
    path: ROUTES_DEFINITION.CREANCE_ADD,
    component: AddCreance,
  },
  {
    path: ROUTES_DEFINITION.CREANCE_VIEW,
    component: ExpenseList,
  },
  {
    path: ROUTES_DEFINITION.CREANCE_EDIT,
    component: EditCreance,
  },
  {
    path: ROUTES_DEFINITION.EXPENSE_LIST,
    component: ExpenseList,
  },
  {
    path: ROUTES_DEFINITION.EXPENSE_ADD,
    component: AddExpense,
  },
  {
    path: ROUTES_DEFINITION.EXPENSE_VIEW,
    component: ExpenseList,
  },
  {
    path: ROUTES_DEFINITION.EXPENSE_EDIT,
    component: EditExpense,
  },
  {
    path: ROUTES_DEFINITION.DISTRIBUTION,
    component: Distribution,
  },
  {
    path: ROUTES_DEFINITION.RESULTS,
    component: Results,
  },
  {
    path: ROUTES_DEFINITION.CATEGORIES_LIST,
    component: CategoryList,
  },
  {
    path: ROUTES_DEFINITION.USER_LIST,
    component: UserList,
  },
  {
    path: ROUTES_DEFINITION.EXPORT,
    component: Export,
  },
  // /!\ Should remain last
  {
    path: ROUTES_DEFINITION.ROOT,
    component: CreanceList,
  },
];

export type Route = LeafRoute;
export type RouteName = keyof typeof ROUTES_DEFINITION;

export const isLeafRoute = (route: Route): route is LeafRoute =>
  "component" in route;

export const getRouteDefinition = (route: RouteName) =>
  ROUTES_DEFINITION[route];

export const getPath = (
  route: RouteName,
  parameters?: { [key: string]: string }
) =>
  (parameters ? Object.entries(parameters) : []).reduce(
    (acc: string, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), value),
    ROUTES_DEFINITION[route]
  ) as RouteName;

export const getEditExpensePath = (id: UID) =>
  getPath(ROUTES.EXPENSE_EDIT, { id });
