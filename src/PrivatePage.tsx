import { Container } from "./ui/Container/Container";
import { LoadingIcon } from "./ui/Button/LoadingIcon";
import { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { useAuthentication } from "./hooks/useAnthentication";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const { state } = useAuthentication();

  switch (state.type) {
    case "loading":
      return (
        <Container
          styles={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "inverted",
            padding: "l",
            color: "inverted",
          }}
        >
          <LoadingIcon size="l" />
        </Container>
      );
    case "unauthenticated":
      return <Redirect to="LOGIN" />;
    case "authenticated":
      return <>{children}</>;
  }
}
