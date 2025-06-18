import { Card } from "../../ui/Card/Card";
import { Container } from "../../ui/Container/Container";
import { Heading } from "../../ui/Heading/Heading";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import { UserForm, type FormData } from "../users/UserForm";
import { useTranslation } from "react-i18next";

type SetCurrentUserPageProps = {
  onSubmit: (data: FormData) => void;
};

export function SetCurrentUserPage({ onSubmit }: SetCurrentUserPageProps) {
  const { t } = useTranslation();

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
      <Container styles={{ maxWidth: "40rem", background: "transparent" }}>
        <Card>
          <Stack alignItems="center" gap="m">
            <Heading styles={{ font: "body-larger" }}>
              {t("page.setCurrentUser.title")}
            </Heading>
            <Paragraph styles={{ font: "body-default", textAlign: "center" }}>
              {t("page.setCurrentUser.description")}
            </Paragraph>
            <UserForm
              onSubmit={onSubmit}
              submitLabel={t("page.setCurrentUser.actions.submit")}
            />
          </Stack>
        </Card>
      </Container>
    </Container>
  );
}
