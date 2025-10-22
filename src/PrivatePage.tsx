import { Container } from "./ui/Container/Container";
import { LoadingIcon } from "./ui/Button/LoadingIcon";
import type { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { useStore } from "./store/useStore";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const [store] = useStore();

  switch (store.type) {
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
    case "ready":
      return <Redirect to="LOGIN" />;
    case "authenticated":
      return <>{children}</>;
  }
}
