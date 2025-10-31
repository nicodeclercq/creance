import { Button } from "../../ui/Button/Button";
import { Columns } from "../../ui/Columns/Columns";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

export function ResetStateConfirmationDialog({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  return (
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
          onClick={onCancel}
          variant="secondary"
          label={t("ResetStateConfirmationDialog.actions.cancel")}
        />
        <Button
          onClick={onSubmit}
          variant="primary"
          label={t("ResetStateConfirmationDialog.actions.submit")}
        />
      </Columns>
    </Stack>
  );
}
