import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import { useAuth } from "../../domain/auth/useAuth";
import { User } from "../../domain/auth/User";

export type PrivateRouteProps = {
  user: User;
};

export const PrivateRoute = ({
  component: Component,
}: {
  component: (props: PrivateRouteProps) => JSX.Element;
}): JSX.Element => {
  const { isLogged, user } = useAuth();

  useEffect(() => {
    if (!isLogged) {
      redirect("HOME");
    }
  }, [isLogged]);

  return user != null ? <Component user={user} /> : <></>;
};
