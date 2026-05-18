import { useEffect, useRef, useState } from "react";

import { Alert } from "../../../ui/Alert/Alert";
import { Container } from "../../../ui/Container/Container";
import type { Credentials } from "../../../store/adapters/AuthManager";
import { LoadingIcon } from "../../../ui/Button/LoadingIcon";
import { LoginForm } from "./LoginForm";
import { Modal } from "../../../ui/Modal/Modal";
import { ROUTES_DEFINITION } from "../../../routes";
import { redirect } from "react-router-dom";
import { useAuth } from "../../../store/useAuth";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const isMount = useRef<boolean>(false);

  useEffect(() => {
    isMount.current = true;
    () => {
      isMount.current = false;
    };
  }, []);

  const cancel = () => login();

  const submit = (credentials: Credentials) => {
    setError(undefined);
    setIsLoading(true);

    return login(credentials)
      .catch((e: Error) => setError(e.message))
      .finally(() => {
        if (isMount.current) {
          setIsLoading(false);
        }
      })
      .then(() => {
        redirect(ROUTES_DEFINITION.EVENT_LIST.path);
      });
  };

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
      <Modal isOpen title={t("LoginForm.title")}>
        <Alert type="subtle">{t("LoginForm.alert")}</Alert>
        <LoginForm
          cancel={{
            onClick: cancel,
            label: t("LoginForm.actions.continueAnonymously"),
          }}
          onSubmit={submit}
          errorMessage={error}
          isLoading={isLoading}
        />
      </Modal>
    </Container>
  );
}
