import * as Either from "fp-ts/Either";

import {
  exportData,
  importData,
  toExportedData,
} from "../../service/importExport";

import { Avatar } from "../../ui/Avatar/Avatar";
import { Button } from "../../ui/Button/Button";
import { COLLECTIONS } from "../../service/firebase";
import { Card } from "../../ui/Card/Card";
import { Columns } from "../../ui/Columns/Columns";
import { ConfirmButton } from "../../ui/ConfirmButton/ConfirmButton";
import { DateFormatter } from "../../ui/DateFormatter/DateFormatter";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { lastUpdate } from "../../service/synchronize";
import { resetStore } from "../../store/reset";
import { useRoute } from "../../hooks/useRoute";
import { useState } from "react";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

function Item({ label, date }: { label: string; date: Date }) {
  return (
    <Columns wrap gap="s" align="baseline">
      <Paragraph>{label}</Paragraph>
      <DateFormatter
        format="medium"
        withTime
        styles={{ font: "body-small", color: "neutral-weak" }}
      >
        {date}
      </DateFormatter>
    </Columns>
  );
}

export function InformationPage() {
  const { t } = useTranslation();
  const { goTo, back } = useRoute();
  const [hasImportError, setHasImportError] = useState(false);

  const [currentUserId] = useStore("currentUserId");
  const [users, setUsers] = useStore("users");
  const [events, setEvents] = useStore("events");
  const [expenses, setExpenses] = useStore("expenses");
  const [deposits, setDeposits] = useStore("deposits");

  const reset = () => {
    goTo("ROOT");
    resetStore();
  };

  const currentUser = users[currentUserId];

  const doExportData = () => {
    exportData(
      "Créance",
      Object.values(events).map((event) =>
        toExportedData({
          event,
          deposits,
          expenses,
          users: users,
        })
      )
    );
  };
  const doImportData = () => {
    return importData({
      events,
      users,
      expenses,
      deposits,
    }).then(
      Either.fold(
        (error) => {
          console.error("Import failed:", error);
          setHasImportError(true);
        },
        (data) => {
          setHasImportError(false);

          setUsers((users) => ({ ...users, ...data.users }));
          setEvents((events) => ({ ...events, ...data.events }));
          setExpenses((expenses) => ({ ...expenses, ...data.expenses }));
          setDeposits((deposits) => ({ ...deposits, ...data.deposits }));
          goTo(ROUTES.ROOT);
        }
      )
    );
  };

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
            <Paragraph styles={{ font: "body-smaller", color: "neutral-weak" }}>
              {currentUserId}
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack gap="s">
            <Paragraph styles={{ font: "body-large" }}>
              {t("page.information.synchronization")}
            </Paragraph>
            <Item
              label={COLLECTIONS.USERS}
              date={lastUpdate.get(COLLECTIONS.USERS)}
            />
            <Item
              label={COLLECTIONS.EVENTS}
              date={lastUpdate.get(COLLECTIONS.EVENTS)}
            />
            <Item
              label={COLLECTIONS.EXPENSES}
              date={lastUpdate.get(COLLECTIONS.EXPENSES)}
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
