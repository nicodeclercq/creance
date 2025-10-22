import { ANONYMOUS_USER, type User } from "../../models/User";
import { uid } from "../../service/crypto";
import { useData } from "../../store/useData";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import {
  ParticipantForm,
  type FormData,
} from "../participants/ParticipantForm";
import { useTranslation } from "react-i18next";

type SetCurrentParticipantPageProps = {
  defaultData?: User;
  onSubmit: (data: User) => void;
  onCancel?: () => void;
};

const fromUserToFormData = (user: User): FormData => {
  return {
    name: user.name,
    avatar: user.avatar,
    share: user.share,
  };
};

const toUserFromFormData = (formData: FormData, defaultData?: User): User => {
  return {
    ...(defaultData ?? {
      _id: uid(),
    }),
    name: formData.name,
    avatar: formData.avatar,
    share: formData.share,
    updatedAt: new Date(),
  };
};

export function SetCurrentParticipantForm({
  defaultData,
  onSubmit,
  onCancel,
}: SetCurrentParticipantPageProps) {
  const { t } = useTranslation();
  const [users] = useData("users");

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
        users={users ?? {}}
        onSubmit={submit}
        cancel={
          onCancel
            ? {
                label: t("page.setCurrentParticipant.actions.cancel"),
                onCancel,
              }
            : undefined
        }
        submitLabel={t("page.setCurrentParticipant.actions.submit")}
      />
    </Stack>
  );
}
