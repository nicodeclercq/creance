export const ROUTE = {
  HOME: "/",
} as const;

export type RouteName = keyof typeof ROUTE;
export type RoutePath<P extends RouteName> = typeof ROUTE[P];
