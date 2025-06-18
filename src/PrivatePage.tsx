import { Container } from "./ui/Container/Container";
import { FormData } from "./pages/users/UserForm";
import { LoadingIcon } from "./ui/Button/LoadingIcon";
import { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { SetCurrentUserPage } from "./pages/auth/SetCurrentUserPage";
import { useAuthentication } from "./hooks/useAnthentication";
import { useStore } from "./store/StoreProvider";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const { state } = useAuthentication();
  const [currentUserId] = useStore("currentUserId");
  const [currentUser, setCurrentUser] = useStore(`users.${currentUserId}`);

  const submit = (data: FormData) => {
    setCurrentUser(() => ({
      _id: currentUserId,
      updatedAt: new Date(),
      ...data,
    }));
  };

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
      return currentUser == null ? (
        <SetCurrentUserPage onSubmit={submit} />
      ) : (
        <>{children}</>
      );
  }
}
