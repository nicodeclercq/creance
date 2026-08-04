import type { FirebaseError } from "firebase/app";
import { Heading } from "../../../ui/Heading/Heading";
import { SignupForm } from "../../auth/private/SignupForm";
import { Stack } from "../../../ui/Stack/Stack";
import { useAuth } from "../../../store/useAuth";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type SignupProps = {
  onNext: () => void;
  switchToLogin: () => void;
};

export function Signup({ onNext, switchToLogin }: SignupProps) {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  return (
    <Stack gap="m">
      <Heading>{t("SignupForm.title")}</Heading>
      <SignupForm
        errorMessage={errorMessage}
        onSubmit={(credentials) =>
          signup(credentials)
            .then(onNext)
            .catch((error: FirebaseError) => {
              console.log(error);
              setErrorMessage(t(`Signup.error.message.${error.code}`));
            })
        }
        cancel={{
          label: t("SignupForm.actions.login"),
          onClick: switchToLogin,
        }}
      />
    </Stack>
  );
}
