import { useData } from "../../store/useData";
import { Card } from "../../ui/Card/Card";
import { Container } from "../../ui/Container/Container";
import { Heading } from "../../ui/Heading/Heading";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import {
  ParticipantForm,
  type FormData,
} from "../participants/ParticipantForm";
import { useTranslation } from "react-i18next";

type SetCurrentParticipantPageProps = {
  onSubmit: (data: FormData) => void;
};

export function SetCurrentParticipantPage({
  onSubmit,
}: SetCurrentParticipantPageProps) {
  const { t } = useTranslation();
  const [account] = useData("account");

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
      <Container styles={{ maxWidth: "40rem" }}>
        <Card>
          <Stack alignItems="center" gap="m">
            <Heading styles={{ font: "body-larger" }}>
              {t("page.setCurrentParticipant.title")}
            </Heading>
            <Paragraph styles={{ font: "body-default", textAlign: "center" }}>
              {t("page.setCurrentParticipant.description")}
            </Paragraph>
            <ParticipantForm
              defaultValue={{
                name: "",
                avatar: "",
                share: {
                  adults: 0,
                  children: 0,
                },
              }}
              users={account?.users ?? {}}
              onSubmit={onSubmit}
              submitLabel={t("page.setCurrentParticipant.actions.submit")}
            />
          </Stack>
        </Card>
      </Container>
    </Container>
  );
}
