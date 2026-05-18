import { Heading } from "../../../ui/Heading/Heading";
import { LoginForm } from "../../auth/private/LoginForm";
import { Stack } from "../../../ui/Stack/Stack";
import { useAuth } from "../../../store/useAuth";
import { useTranslation } from "react-i18next";

type LoginProps = {
  onNext: () => void;
  switchToSignup: () => void;
};

export function Login({ onNext, switchToSignup }: LoginProps) {
  const { t } = useTranslation();
  const { login } = useAuth();

  return (
    <Stack gap="m">
      <Heading>{t("LoginForm.title")}</Heading>
      <LoginForm
        onSubmit={(credentials) => login(credentials).then(onNext)}
        cancel={{
          label: t("LoginForm.actions.signup"),
          onClick: switchToSignup,
        }}
      />
    </Stack>
  );
}
