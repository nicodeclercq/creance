import {
  exportData,
  importData,
  toExportedData,
} from "../../service/importExport";

import { Button } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { ConfirmButton } from "../../ui/ConfirmButton/ConfirmButton";
import { Logger } from "../../service/Logger";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../router/routes";
import { Select } from "../../ui/FormField/Select/Select";
import { Stack } from "../../ui/Stack/Stack";
import { fork } from "../../helpers/fp-ts";
import { pipe } from "fp-ts/function";
import { resetStore } from "../../store/reset";
import { useData } from "../../store/useData";
import { useRoute } from "../../hooks/useRoute";
import { useState, type ReactNode } from "react";
import { useTheme, type Theme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { LightThemeImage } from "./private/LightThemeImage";
import { DarkThemeImage } from "./private/DarkThemeImage";
import { SystemThemeImage } from "./private/SystemThemeImage";
import { updateMergeableRecord } from "../../models/mergeable";
import { useCurrentUser } from "../../store/useCurrentUser";
import { generateKey, uid } from "../../service/crypto";
import { lastBuiltAt } from "../../secrets";

const ThemeImage = ({ theme }: { theme: Theme | "system" }): ReactNode => {
  switch (theme) {
    case "light":
      return <LightThemeImage />;
    case "dark":
      return <DarkThemeImage />;
    case "system":
      return <SystemThemeImage />;
  }
};

export function InformationPage() {
  const { t } = useTranslation();
  const { goTo, back } = useRoute();
  const [hasImportError, setHasImportError] = useState(false);
  const { theme, changeTheme } = useTheme();

  const { userId } = useCurrentUser();
  const [events, setEvents] = useData("events");
  const [account, setAccount] = useData("account");

  const reset = () => {
    goTo("ROOT");
    resetStore();
  };

  const doExportData = () =>
    exportData(
      "Créances",
      Object.values(events.collection).map((event) =>
        toExportedData({
          event,
        }),
      ),
    );

  const doImportData = () =>
    pipe(
      importData({ events: events.collection }),
      fork({
        onError: (error) => {
          Logger.error("Import failed:")(error);
          setHasImportError(true);
        },
        onSuccess: (data) => {
          setHasImportError(false);
          const missingEventIds = Object.keys(data.events).filter(
            (eventId) => account.events.collection[eventId] === undefined,
          );

          Promise.all(
            missingEventIds.map((eventId) =>
              generateKey(uid()).then(
                (eventKey) => [eventId, eventKey] as const,
              ),
            ),
          ).then((generatedEventKeys) => {
            const importedAccountEvents = generatedEventKeys.reduce<
              typeof account.events.collection
            >(
              (acc, [eventId, eventKey]) => ({
                ...acc,
                [eventId]: {
                  eventId: eventKey,
                  userId,
                  updatedAt: new Date(),
                },
              }),
              {},
            );

            setEvents((events) =>
              updateMergeableRecord({
                ...events,
                collection: { ...events.collection, ...data.events },
              }),
            );

            setAccount((currentAccount) =>
              updateMergeableRecord({
                ...currentAccount,
                events: updateMergeableRecord({
                  ...currentAccount.events,
                  collection: {
                    ...currentAccount.events.collection,
                    ...importedAccountEvents,
                  },
                }),
              }),
            );

            goTo(ROUTES.ROOT);
          });
        },
      }),
    );

  const themeOptions = [
    { id: "light", label: t("settings.theme.light"), value: "light" as const },
    { id: "dark", label: t("settings.theme.dark"), value: "dark" as const },
    {
      id: "system",
      label: t("settings.theme.system"),
      value: "system" as const,
    },
  ];

  const setThemeSetting = (theme: Theme | "system") => {
    changeTheme(theme === "system" ? undefined : theme);
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
            {!userId && (
              <Paragraph>{t("page.information.disconnected")}</Paragraph>
            )}
            <Paragraph styles={{ font: "body-smaller", color: "neutral-weak" }}>
              {userId}
            </Paragraph>
            <Paragraph styles={{ font: "body-small" }}>
              {t("page.information.lastBuildTime", {
                date: new Date(lastBuiltAt).toLocaleDateString(),
              })}
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack gap="s">
            <Paragraph styles={{ font: "body-large" }}>
              {t("settings.theme.title")}
            </Paragraph>
            <Select
              label={t("settings.theme.label")}
              value={theme ?? "system"}
              onChange={setThemeSetting}
              options={themeOptions}
              valueRenderer={({ value }) => <ThemeImage theme={value} />}
            />
          </Stack>
        </Card>
        <Card>
          <Stack gap="s">
            <Paragraph styles={{ font: "body-large" }}>
              {t("page.information.synchronization")}
            </Paragraph>
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
