import { ANONYMOUS_USER, type User } from "../models/User";
import { Container } from "../ui/Container/Container";
import { LoadingIcon } from "../ui/Button/LoadingIcon";
import { LoginPage } from "../pages/auth/private/LoginPage";
import { Modal } from "../ui/Modal/Modal";
import { SetCurrentParticipantForm } from "../pages/auth/SetCurrentParticipantForm";
import type { ReactNode } from "react";
import { useAuth } from "../store/useAuth";
import { useData } from "../store/useData";
import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../store/useCurrentUser";

type Props = {
  children: ReactNode;
};

const fullScreenStyles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "inverted",
  padding: "l",
  color: "inverted",
} as const;

export function PrivatePage({ children }: Props) {
  const { t } = useTranslation();
  const store = useStore();
  const { state } = useAuth();
  const { setCurrentUser, userId } = useCurrentUser();
  const [users] = useData("users.collection");

  const isAnonymous = userId === ANONYMOUS_USER._id;

  const handleSetParticipant = (user: User) => {
    setCurrentUser(() => user);
  };

  switch (store.status) {
    case "loading":
      return (
        <Container styles={fullScreenStyles}>
          <LoadingIcon size="l" />
        </Container>
      );
    case "error":
      return (
        <Container styles={fullScreenStyles}>
          Error: {store.error.message}
        </Container>
      );
    case "ready":
      if (state.type === "initial") return <LoginPage />;
      if (isAnonymous)
        return (
          <Container styles={fullScreenStyles}>
            <Modal
              isOpen
              isDismissable={false}
              title={t("page.setCurrentParticipant.title")}
            >
              <SetCurrentParticipantForm
                users={users}
                onSubmit={handleSetParticipant}
              />
            </Modal>
          </Container>
        );
      return <>{children}</>;
  }
}
