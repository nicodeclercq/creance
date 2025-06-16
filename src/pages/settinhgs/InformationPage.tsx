import { Avatar } from "../../ui/Avatar/Avatar";
import { Card } from "../../ui/Card/Card";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function InformationPage() {
  const { t } = useTranslation();
  const { back } = useRoute();

  const [currentUserId] = useStore("currentUserId");
  const [users] = useStore("users");

  const currentUser = users[currentUserId];

  return (
    <PageTemplate
      title={t("page.information.title")}
      leftAction={{
        label: t("page.information.actions.back"),
        icon: "chevron-left",
        onClick: back,
      }}
    >
      <Stack gap="m" alignItems="center">
        <Card>
          <Stack gap="s" alignItems="center">
            {!currentUserId && (
              <Paragraph>{t("page.information.disconnected")}</Paragraph>
            )}
            {currentUser ? (
              <>
                <Avatar label={currentUser.name} size="l" />
                <Paragraph styles={{ font: "body-large" }}>
                  {currentUser.name}
                </Paragraph>
              </>
            ) : (
              <Paragraph>{t("page.information.noUser")}</Paragraph>
            )}
            <Paragraph styles={{ font: "body-smaller" }}>
              {currentUserId}
            </Paragraph>
          </Stack>
        </Card>
      </Stack>
    </PageTemplate>
  );
}
