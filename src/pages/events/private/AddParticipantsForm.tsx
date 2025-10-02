import { Controller, useForm } from "react-hook-form";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Participant } from "../../../models/Participant";
import { ParticipantShare } from "../../../models/ParticipantShare";
import { uid } from "../../../service/crypto";
import { useTranslation } from "react-i18next";

type AddParticipantsFormProps = {
  participants: Participant[];
  onAdd: (participant: Participant) => void;
};

type AddParticipantsFormData = {
  name: string;
  adults: number;
  children: number;
};
export function AddParticipantsForm({
  onAdd,
  participants: participants,
}: AddParticipantsFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, reset } =
    useForm<AddParticipantsFormData>({
      defaultValues: {
        name: "",
        adults: 1,
        children: 0,
      },
    });

  const addParticipant = (data: AddParticipantsFormData) => {
    const newParticipant: Participant = {
      _id: uid(),
      name: data.name,
      avatar: "",
      share: {
        adults: data.adults,
        children: data.children,
      },
      participantShare: { type: "default" } as ParticipantShare,
      updatedAt: new Date(),
    };
    onAdd(newParticipant);
    reset();
  };

  return (
    <div>
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <Avatar label={watch("name")} image={""} size="m" />
      </div>
      <Controller
        control={control}
        rules={{
          required: t(
            "page.events.add.form.participant.name.validation.required"
          ),
          validate: {
            isUnique: (value) => {
              const isUnique = !participants.some(
                (participant) => participant.name === value
              );
              return (
                isUnique ||
                t("page.events.add.form.participant.name.validation.isUnique")
              );
            },
          },
        }}
        name="name"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <div>
            <InputText
              type="text"
              value={value}
              onChange={onChange}
              label={t("page.events.add.form.participant.name.label")}
              isRequired
              error={error?.message}
            />
          </div>
        )}
      />
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <IconButton
          icon="add"
          label={t("page.events.add.form.participant.share.submit")}
          onClick={handleSubmit(addParticipant)}
          variant="tertiary"
        />
      </div>
      <div>{t("page.events.add.form.participant.share.label")}</div>
      <Controller
        control={control}
        rules={{
          min: {
            value: 0,
            message: t(
              "page.events.add.form.participant.share.adults.validation.min"
            ),
          },
        }}
        name="adults"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            as="number"
            type="number"
            value={value}
            onChange={onChange}
            label={t("page.events.add.form.participant.share.adults.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        rules={{
          min: {
            value: 0,
            message: t(
              "page.events.add.form.participant.share.children.validation.min"
            ),
          },
        }}
        name="children"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            as="number"
            type="number"
            value={value}
            onChange={onChange}
            label={t("page.events.add.form.participant.share.children.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
    </div>
  );
}
