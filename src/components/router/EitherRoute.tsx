import React from "react";
import { useAuth } from "../../domain/auth/useAuth";
import { PrivateRouteProps } from "./PrivateRoute";

export const EitherRoute = ({
  onLogged: LoggedComponent,
  onUnlogged: UnloggedComponent,
}: {
  onLogged: (props: PrivateRouteProps) => JSX.Element;
  onUnlogged: () => JSX.Element;
}): JSX.Element => {
  const { isLogged, user } = useAuth();

  return isLogged && user != null ? (
    <LoggedComponent user={user} />
  ) : (
    <UnloggedComponent />
  );
};
