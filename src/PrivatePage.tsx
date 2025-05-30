import { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { useAuthentication } from "./hooks/useAnthentication";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const { isAuthenticated } = useAuthentication();

  return isAuthenticated ? <>{children}</> : <Redirect to="LOGIN" />;
}
