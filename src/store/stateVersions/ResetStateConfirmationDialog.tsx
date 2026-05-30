import { Button } from "../../ui/Button/Button";
import { Columns } from "../../ui/Columns/Columns";
import { FixTextForm } from "./FixStateForm";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import type { State } from "../state";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ResetStateConfirmationDialog(state: unknown) {
  return function ResetStateConfirmationDialogContent({
    onSubmit,
  }: {
    onSubmit: (state: undefined | State) => void;
  }) {
    const { t } = useTranslation();
    const [isFixing, setIsFixing] = useState(false);

    return isFixing ? (
      <FixTextForm
        defaultState={state}
        onSubmit={onSubmit}
        onCancel={() => setIsFixing(false)}
      />
    ) : (
      <Stack alignItems="center" gap="m">
        <Paragraph
          styles={{
            font: "body-default",
            textAlign: "center",
            maxWidth: "64rem",
            padding: "m",
          }}
        >
          {t("ResetStateConfirmationDialog.description")}
        </Paragraph>
        <Columns align="center" justify="space-between">
          <Button
            onClick={() => setIsFixing(true)}
            variant="secondary"
            label={t("ResetStateConfirmationDialog.actions.fix")}
          />
          <Button
            onClick={() => onSubmit(undefined)}
            variant="primary"
            label={t("ResetStateConfirmationDialog.actions.submit")}
          />
        </Columns>
      </Stack>
    );
  };
}
