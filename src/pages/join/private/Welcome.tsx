import { Button } from "../../../ui/Button/Button";
import { Columns } from "../../../ui/Columns/Columns";
import { Heading } from "../../../ui/Heading/Heading";
import { LoginOrSignup } from "./LoginOrSignup";
import { Logo } from "../../../ui/Logo/Logo";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Stack } from "../../../ui/Stack/Stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type WelcomeProps = {
  onNext: (isNewUser: boolean) => void;
};

export function Welcome({ onNext }: WelcomeProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"login" | "signup" | "welcome">("welcome");

  const goToLogin = () => {
    setStep("login");
  };
  const goToSignUp = () => {
    setStep("signup");
  };

  return step === "welcome" ? (
    <Stack gap="l">
      <Stack gap="m">
        <Columns gap="s" align="center">
          <Logo show="pig" hasBackground size="xl" />
          <Heading>{t("JoinPage.title")}</Heading>
        </Columns>
        <Paragraph
          styles={{
            font: "body-large",
          }}
        >
          {t("JoinPage.welcome.description")}
        </Paragraph>
        <Paragraph>{t("JoinPage.welcome.needLogin")}</Paragraph>
      </Stack>
      <Columns justify="end" gap="m">
        <Button
          label={t("JoinPage.welcome.action.login")}
          onClick={goToLogin}
          variant="secondary"
        />
        <Button
          label={t("JoinPage.welcome.action.signup")}
          onClick={goToSignUp}
        />
      </Columns>
    </Stack>
  ) : (
    <LoginOrSignup onNext={onNext} initialState={step} />
  );
}
