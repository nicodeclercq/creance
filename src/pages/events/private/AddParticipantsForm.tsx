import { Controller, useForm } from "react-hook-form";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import type { Participant } from "../../../models/Participant";
import type { ParticipantShare } from "../../../models/ParticipantShare";
import { uid } from "../../../service/crypto";
import { useTranslation } from "react-i18next";
import { userSchema } from "../../../models/User";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type AddParticipantsFormProps = {
  participants: Participant[];
  onAdd: (participant: Participant) => void;
};

const createAddParticipantsFormSchema = (
  t: ReturnType<typeof useTranslation>["t"],
  participants: Participant[]
) =>
  z.object({
    name: userSchema.shape.name
      .min(1, t("page.events.add.form.participant.name.validation.required"))
      .refine(
        (value) => !participants.some((p) => p.name === value),
        t("page.events.add.form.participant.name.validation.isUnique")
      ),
    adults: userSchema.shape.share.shape.adults.min(
      0,
      t("page.events.add.form.participant.share.adults.validation.min")
    ),
    children: userSchema.shape.share.shape.children.min(
      0,
      t("page.events.add.form.participant.share.children.validation.min")
    ),
  });

type AddParticipantsFormData = z.infer<
  ReturnType<typeof createAddParticipantsFormSchema>
>;

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
      resolver: zodResolver(createAddParticipantsFormSchema(t, participants)),
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
