import { Container } from "../../ui/Container/Container";
import { LoadingIcon } from "../../ui/Button/LoadingIcon";
import { Logo } from "../../ui/Logo/Logo";

export function LoadingPage() {
  return (
    <Container
      styles={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "inverted",
        gap: "l",
        color: "inverted",
      }}
    >
      <LoadingIcon size="l" />
      <Logo size="xl" show="text" />
    </Container>
  );
}
