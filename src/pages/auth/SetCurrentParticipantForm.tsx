import { ANONYMOUS_USER, type User } from "../../models/User";
import { uid } from "../../service/crypto";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import {
  ParticipantForm,
  type FormData,
} from "../participants/ParticipantForm";
import { useTranslation } from "react-i18next";
import { createMergeableRecord } from "../../models/mergeable";

type SetCurrentParticipantPageProps = {
  defaultData?: User;
  users?: Record<string, User>;
  onSubmit: (data: User) => void;
  onCancel?: () => void;
  cancelLabel?: string;
};

const fromUserToFormData = (user: User): FormData => {
  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    share: user.share,
  };
};

const toUserFromFormData = (formData: FormData, defaultData?: User): User =>
  createMergeableRecord({
    ...(defaultData ?? {
      _id: uid(),
    }),
    name: formData.name,
    avatar: formData.avatar,
    share: formData.share,
  });

export function SetCurrentParticipantForm({
  defaultData,
  users = {},
  onSubmit,
  onCancel,
  cancelLabel,
}: SetCurrentParticipantPageProps) {
  const { t } = useTranslation();

  const submit = (formData: FormData) => {
    onSubmit(toUserFromFormData(formData, defaultData));
  };

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
        {t("page.setCurrentParticipant.description")}
      </Paragraph>
      <ParticipantForm
        defaultValue={
          defaultData ? fromUserToFormData(defaultData) : ANONYMOUS_USER
        }
        users={users}
        onSubmit={submit}
        cancel={
          onCancel
            ? {
                label:
                  cancelLabel ?? t("page.setCurrentParticipant.actions.cancel"),
                onCancel,
              }
            : undefined
        }
        submitLabel={t("page.setCurrentParticipant.actions.submit")}
      />
    </Stack>
  );
}
