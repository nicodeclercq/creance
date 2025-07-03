import { Container } from "./ui/Container/Container";
import { FormData } from "./pages/participants/ParticipantForm";
import { LoadingIcon } from "./ui/Button/LoadingIcon";
import { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { SetCurrentParticipantPage } from "./pages/auth/SetCurrentParticipantPage";
import { useAuthentication } from "./hooks/useAnthentication";
import { useStore } from "./store/StoreProvider";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const { state } = useAuthentication();
  const [currentParticipantId] = useStore("currentParticipantId");
  const [account, setAccount] = useStore("account");

  const submit = (data: FormData) => {
    setAccount(() => ({
      _id: currentParticipantId,
      eventKeys: {},
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
      return !currentParticipantId || !account?._id ? (
        <SetCurrentParticipantPage onSubmit={submit} />
      ) : (
        <>{children}</>
      );
  }
}
