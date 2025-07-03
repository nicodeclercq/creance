import { Controller, useForm } from "react-hook-form";

import { Card } from "../../ui/Card/Card";
import { Container } from "../../ui/Container/Container";
import { Form } from "../../ui/Form/Form";
import { Heading } from "../../ui/Heading/Heading";
import { InputPassword } from "../../ui/FormField/InputPassword/InputPassword";
import { InputText } from "../../ui/FormField/InputText/InputText";
import { PigImage } from "../../ui/Pig";
import { Redirect } from "../../Redirect";
import { Stack } from "../../ui/Stack/Stack";
import { loginParticipant } from "../../service/firebase";
import styles from "./LoginPage.module.css";
import { useAuthentication } from "../../hooks/useAnthentication";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { state } = useAuthentication();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (state.type === "authenticated") {
    return <Redirect to="EVENT_LIST" />;
  }

  const hasError = Object.keys(formState.errors).length > 0;

  const submit = (data: { email: string; password: string }) =>
    loginParticipant(data)().then(() => {
      goTo("EVENT_LIST");
    });

  return (
    <Container
      styles={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        background: "inverted",
        padding: "l",
      }}
    >
      <Stack alignItems="center" gap="m">
        <div className={styles.pigContainer}>
          <PigImage width="25vw" />
        </div>
        <Card padding="m" styles={{ maxWidth: "40rem" }}>
          <Form
            hasError={hasError}
            handleSubmit={handleSubmit}
            submit={{
              label: t("page.login.actions.submit"),
              onClick: submit,
            }}
          >
            <Stack
              gap="m"
              alignItems="stretch"
              styles={{ background: "default", zIndex: 1 }}
            >
              <Heading level={1} styles={{ font: "body-larger" }}>
                {t("page.login.title")}
              </Heading>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    type="email"
                    label={t("page.login.email.label")}
                    isRequired
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <InputPassword
                    type="password"
                    label={t("page.login.password.label")}
                    isRequired
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
          </Form>
        </Card>
      </Stack>
    </Container>
  );
}
