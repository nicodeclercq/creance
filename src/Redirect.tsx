import { Navigate } from "react-router-dom";
import { type RouteName, ROUTES_DEFINITION } from "./routes";

type Props = {
  to: RouteName;
  params?: Record<string, string | number>;
};

export function Redirect({ to, params = {} }: Props) {
  const url = Object.entries(params).reduce(
    (u, [name, value]) => u.replace(`:${name}`, `${value}`),
    ROUTES_DEFINITION[to].path as string
  );

  return <Navigate to={url} replace />;
}
