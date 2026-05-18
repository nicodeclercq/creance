import { Heading } from "../../../ui/Heading/Heading";
import { LoginForm } from "../../auth/private/LoginForm";
import { Stack } from "../../../ui/Stack/Stack";
import { useAuth } from "../../../store/useAuth";
import { useTranslation } from "react-i18next";

type SignupProps = {
  onNext: () => void;
  switchToLogin: () => void;
};

export function Signup({ onNext, switchToLogin }: SignupProps) {
  const { t } = useTranslation();
  const { signup } = useAuth();

  return (
    <Stack gap="m">
      <Heading>{t("SignupForm.title")}</Heading>
      <LoginForm
        onSubmit={(credentials) => signup(credentials).then(onNext)}
        cancel={{
          label: t("SignupForm.actions.login"),
          onClick: switchToLogin,
        }}
      />
    </Stack>
  );
}
