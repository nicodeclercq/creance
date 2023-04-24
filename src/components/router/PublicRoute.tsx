import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import { useAuth } from "../../domain/auth/useAuth";

type PrivateRouteProps = {};

export const PublicRoute = ({
  component: Component,
}: {
  component: (props: PrivateRouteProps) => JSX.Element;
}): JSX.Element => {
  const { isLogged } = useAuth();

  useEffect(() => {
    if (isLogged) {
      redirect("HOME");
    }
  }, [isLogged]);

  return <Component />;
};
