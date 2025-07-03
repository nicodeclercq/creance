import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { Form } from "../../../ui/Form/Form";
import { Fragment } from "react/jsx-runtime";
import { Grid } from "../../../ui/Grid/Grid";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { ParticipantShare } from "../../../models/ParticipantShare";
import styles from "./AddEventStep3.module.css";
import { uid } from "../../../service/crypto";
import { useStore } from "../../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export type Step3Data = {
  participants: Participant[];
};
type AddEventStep3Props = {
  data: Step3Data;
  onNext: (data: Step3Data) => void;
  onPrevious: (data: Step3Data) => void;
};

type AddParticipantsFormProps = {
  participants: Participant[];
  onAdd: (participant: Participant) => void;
};

type AddParticipantsFormData = {
  name: string;
  adults: number;
  children: number;
};
function AddParticipantsForm({
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
      avatar: data.name,
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
    <div className={styles.addParticipantForm}>
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <Avatar label={watch("name")} size="m" />
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
          <div className={styles.name}>
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
      <div className={styles.fieldLegend}>
        {t("page.events.add.form.participant.share.label")}
      </div>
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

export function AddEventStep3({
  data,
  onNext,
  onPrevious,
}: AddEventStep3Props) {
  const { t } = useTranslation();
  const [currentParticipantId] = useStore("currentParticipantId");
  const { control, handleSubmit, watch, formState, getValues } =
    useForm<Step3Data>({
      defaultValues: data,
      mode: "onBlur",
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const removeParticipant = (id: string) => () => {
    const index = fields.findIndex((item) => item._id === id);
    remove(index);
  };
  const hasError = Object.keys(formState.errors).length > 0;
  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      submit={{
        label: t("page.events.add.form.submit"),
        onClick: onNext,
      }}
      cancel={{
        label: t("page.events.add.form.previous"),
        onClick: () => onPrevious(getValues()),
      }}
    >
      <Grid
        columns={["min-content", "1fr", "min-content"]}
        gap="s"
        align="center"
        justify="start"
      >
        {fields.map((item) => (
          <Fragment key={item._id}>
            <Avatar label={item.name} size="m" />
            <div>
              <Paragraph styles={{ flexGrow: true }}>{item.name}</Paragraph>
              <Paragraph styles={{ font: "body-smaller" }}>
                {t("page.events.add.form.participant.share.count", {
                  adults: item.share.adults,
                  children: item.share.children,
                })}
              </Paragraph>
            </div>
            {item._id === currentParticipantId ? (
              <span></span>
            ) : (
              <IconButton
                variant="tertiary"
                icon="trash"
                label={t("page.events.add.form.participant.remove", {
                  name: item.name,
                })}
                onClick={removeParticipant(item._id)}
              />
            )}
          </Fragment>
        ))}
      </Grid>
      <AddParticipantsForm
        onAdd={(participant: Participant) => append(participant)}
        participants={watch("participants")}
      />
    </Form>
  );
}
