import {
  exportData,
  importData,
  toExportedData,
} from "../../service/importExport";

import { Button } from "../../ui/Button/Button";
import { COLLECTIONS } from "../../store/private/firebase";
import { Card } from "../../ui/Card/Card";
import { Columns } from "../../ui/Columns/Columns";
import { ConfirmButton } from "../../ui/ConfirmButton/ConfirmButton";
import { DateFormatter } from "../../ui/DateFormatter/DateFormatter";
import { Logger } from "../../service/Logger";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { fork } from "../../helpers/fp-ts";
import { lastUpdate } from "../../service/synchronize";
import { pipe } from "fp-ts/function";
import { resetStore } from "../../store/reset";
import { useData } from "../../store/useData";
import { useRoute } from "../../hooks/useRoute";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Item({ label, date }: { label: string; date: Date }) {
  return (
    <Columns wrap gap="s" align="baseline">
      <Paragraph>{label}</Paragraph>
      <Paragraph styles={{ font: "body-small", color: "neutral-weak" }}>
        <DateFormatter format="medium" withTime>
          {date}
        </DateFormatter>
      </Paragraph>
    </Columns>
  );
}

export function InformationPage() {
  const { t } = useTranslation();
  const { goTo, back } = useRoute();
  const [hasImportError, setHasImportError] = useState(false);

  const [currentParticipantId] = useData("account.currentUser._id");
  const [events, setEvents] = useData("events");

  const reset = () => {
    goTo("ROOT");
    resetStore();
  };

  const doExportData = () =>
    exportData(
      "Créances",
      Object.values(events).map((event) =>
        toExportedData({
          event,
        })
      )
    );

  const doImportData = () =>
    pipe(
      importData({ events }),
      fork({
        onError: (error) => {
          Logger.error("Import failed:")(error);
          setHasImportError(true);
        },
        onSuccess: (data) => {
          setHasImportError(false);

          setEvents((events) => ({ ...events, ...data.events }));
          goTo(ROUTES.ROOT);
        },
      })
    );

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
            {!currentParticipantId && (
              <Paragraph>{t("page.information.disconnected")}</Paragraph>
            )}
            <Paragraph styles={{ font: "body-smaller", color: "neutral-weak" }}>
              {currentParticipantId}
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack gap="s">
            <Paragraph styles={{ font: "body-large" }}>
              {t("page.information.synchronization")}
            </Paragraph>
            <Item
              label={COLLECTIONS.EVENTS}
              date={lastUpdate.get(COLLECTIONS.EVENTS)}
            />
            <Button
              variant="secondary"
              onClick={doExportData}
              label="Exporter les données"
              icon={{ name: "download", position: "end" }}
            />
            {hasImportError && (
              <Paragraph styles={{ color: "failure-default" }}>
                {t("page.information.import.error")}
              </Paragraph>
            )}
            <Button
              variant="secondary"
              onClick={doImportData}
              label={t("settings.actions.importData")}
              icon={{ name: "upload", position: "end" }}
            />
            <ConfirmButton
              title={t("page.information.clear.confirmation.title")}
              description={t("page.information.clear.confirmation.description")}
              confirm={{
                label: t("page.information.clear.confirmation.delete"),
                onClick: reset,
              }}
              cancel={{
                label: t("page.information.clear.confirmation.cancel"),
              }}
              action={{
                label: t("page.information.actions.clear"),
                icon: { name: "trash", position: "end" },
                variant: "secondary",
              }}
            />
          </Stack>
        </Card>
      </Stack>
    </PageTemplate>
  );
}
