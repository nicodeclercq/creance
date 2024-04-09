export const ROUTE = {
  HOME: "/",
  CREANCE_LIST: "/creance",
  ADD_CREANCE: "/creance/add",
} as const;

export type RouteName = keyof typeof ROUTE;
export type RoutePath<P extends RouteName> = (typeof ROUTE)[P];
