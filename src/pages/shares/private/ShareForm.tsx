import * as Either from "fp-ts/Either";

import { Button, ButtonProps } from "../../../ui/Button/Button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CustomShare, FormShare, fromShare, toShare } from "./formShare";
import { type Event } from "../../../models/Event";
import { type ParticipantShare } from "../../../models/ParticipantShare";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { CalendarRangePicker } from "../../../ui/FormField/CalendarRangePicker/CalendarRangePicker";
import { Card } from "../../../ui/Card/Card";
import { Columns } from "../../../ui/Columns/Columns";
import { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import { Form } from "../../../ui/Form/Form";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { RadioGroup } from "../../../ui/Form/RadioGroup/RadioGroup";
import { Stack } from "../../../ui/Stack/Stack";
import { Switch } from "../../../ui/Switch";
import { Participant } from "../../../models/Participant";
import styles from "./ShareForm.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Container } from "../../../ui/Container/Container";
import { isInInterval } from "../../../utils/date";
import { ErrorMessage } from "../../../ui/FormField/ErrorMessage/ErrorMessage";
import { Select } from "../../../ui/FormField/Select/Select";

type ShareFormProps = {
  event: Event;
  participant: Participant;
  defaultValues: ParticipantShare;
  submitLabel: string;
  onSubmit: (data: ParticipantShare) => void;
  cancel: DistributiveOmit<ButtonProps, "variant">;
};

function ShareItem({
  item,
  onDelete,
}: {
  item: CustomShare;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.shareItem}>
      <Columns gap="s" align="center">
        <Stack gap="s">
          <Paragraph styles={{ font: "body-default", color: "neutral-strong" }}>
            {t("page.share.form.item.period", {
              start: new Date(item.period.start),
              end: new Date(item.period.end),
            })}
          </Paragraph>
          <Paragraph styles={{ font: "body-small" }}>
            {t("page.events.add.form.field.period.offsets.arrival", {
              arrival: item.arrival,
            })}
          </Paragraph>
          <Paragraph styles={{ font: "body-small" }}>
            {t("page.events.add.form.field.period.offsets.departure", {
              departure: item.departure,
            })}
          </Paragraph>
          <Paragraph styles={{ font: "body-small" }}>
            {t("page.share.form.item.count", {
              adults: item.multiplier.adults,
              children: item.multiplier.children,
            })}
          </Paragraph>
          {item.label && (
            <Paragraph styles={{ font: "body-small" }}>{item.label}</Paragraph>
          )}
        </Stack>
        <IconButton
          onClick={onDelete}
          icon="trash"
          variant="tertiary"
          label="Delete"
        />
      </Columns>
    </div>
  );
}

type ShareItemForm = {
  label: string;
  multiplier: {
    adults: number;
    children: number;
  };
  period: {
    start: Date;
    end: Date;
  };
  arrival: "AM" | "PM";
  departure: "AM" | "PM";
};

type AddShareItemFormProps = {
  event: Event;
  onAdd: (data: ShareItemForm) => void;
};

function AddShareItemForm({ event, onAdd }: AddShareItemFormProps) {
  const { t } = useTranslation();
  const { reset, control, getValues, handleSubmit, trigger } =
    useForm<ShareItemForm>({
      defaultValues: {
        label: "",
        multiplier: {
          adults: 0,
          children: 0,
        },
        period: event.period,
        arrival: "PM",
        departure: "AM",
      },
      mode: "onChange",
    });

  const addPeriod = () => {
    const data = getValues();
    onAdd(data);
    reset();
  };

  return (
    <div className={styles.addShareItemForm}>
      <Controller
        control={control}
        name="label"
        rules={{
          maxLength: {
            value: 100,
            message: t("shareForm.label.validation.maxLength", { max: 100 }),
          },
        }}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={t("page.share.form.type.custom.field.description")}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="multiplier.adults"
        rules={{
          required: t(
            "page.share.form.type.custom.field.shares.adults.validation.required"
          ),
          min: {
            value: 0,
            message: t(
              "page.share.form.type.custom.field.shares.adults.validation.min"
            ),
          },
          validate: (value) => {
            const children = getValues("multiplier.children");
            if (value + children === 0) {
              return t(
                "page.share.form.type.custom.field.shares.multipliers.validation.min"
              );
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("page.share.form.type.custom.field.shares.adult")}
            value={value}
            isRequired
            onChange={(a) => {
              onChange(a);
              trigger("multiplier.children");
            }}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="multiplier.children"
        rules={{
          required: t(
            "page.share.form.type.custom.field.shares.children.validation.required"
          ),
          min: {
            value: 0,
            message: t(
              "page.share.form.type.custom.field.shares.children.validation.min"
            ),
          },
          validate: (value) => {
            const adults = getValues("multiplier.adults");
            if (value + adults === 0) {
              return t(
                "page.share.form.type.custom.field.shares.multipliers.validation.min"
              );
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("page.share.form.type.custom.field.shares.children")}
            value={value}
            onChange={(a) => {
              onChange(a);
              trigger("multiplier.adults");
            }}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Controller
        name="period"
        control={control}
        rules={{
          required: t(
            "page.share.form.type.custom.field.dates.validation.required"
          ),
          validate: (value) => {
            if (isInInterval(event.period)(value)) {
              return t(
                "page.share.form.type.custom.field.dates.validation.between"
              );
            }
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CalendarRangePicker
            type="calendar-range-picker"
            label={t("page.events.add.form.field.dates.label")}
            value={value}
            min={event.period.start}
            max={event.period.end}
            onChange={onChange}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Controller
        name="arrival"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("page.events.add.form.field.arrival.label")}
            value={value}
            onChange={onChange}
            options={[
              {
                id: "AM",
                value: "AM",
                label: t("page.events.add.form.field.period.am"),
              },
              {
                id: "PM",
                value: "PM",
                label: t("page.events.add.form.field.period.pm"),
              },
            ]}
          />
        )}
      />
      <Controller
        name="departure"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("page.events.add.form.field.departure.label")}
            value={value}
            onChange={onChange}
            options={[
              {
                id: "AM",
                value: "AM",
                label: t("page.events.add.form.field.period.am"),
              },
              {
                id: "PM",
                value: "PM",
                label: t("page.events.add.form.field.period.pm"),
              },
            ]}
          />
        )}
      />
      <Container
        styles={{
          padding: "s",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <Button
          onClick={handleSubmit(addPeriod)}
          label={t("page.share.form.type.custom.actions.add")}
          variant="tertiary"
          icon={{ name: "add", position: "start" }}
        />
      </Container>
    </div>
  );
}

export function ShareForm({
  event,
  participant,
  defaultValues,
  submitLabel,
  onSubmit,
  cancel,
}: ShareFormProps) {
  const { t } = useTranslation();

  const { handleSubmit, control, formState, watch } = useForm<FormShare>({
    defaultValues: fromShare(defaultValues),
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "shares",
    rules: {
      validate: (value) => {
        if (type === "custom") {
          if (value.length === 0) {
            return t(
              "page.share.form.type.custom.field.shares.validation.minLength"
            );
          }
        }
      },
    },
  });
  const [showAddForm, setShowAddForm] = useState(fields.length === 0);

  const submit = (data: FormShare) => {
    const share = toShare(data);
    if (Either.isLeft(share)) {
      console.error("Invalid share", share.left);
      return;
    }
    onSubmit(share.right);
  };

  const type = watch("type");

  const hasError = Object.keys(formState.errors).length > 0;

  const addPeriod = (data: ShareItemForm) => {
    append(data);
    setShowAddForm(false);
  };

  return (
    <Card>
      <Form
        handleSubmit={handleSubmit}
        submit={{
          label: submitLabel,
          onClick: submit,
        }}
        cancel={cancel}
        hasError={hasError}
      >
        <Stack gap="m">
          <Columns align="center" justify="center">
            <Stack width="auto" gap="s" alignItems="center">
              <Avatar label={participant.name} size="l" />
              <Paragraph>{participant.name}</Paragraph>
            </Stack>
          </Columns>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                label={t("page.share.form.type.label")}
                value={value}
                isRequired
                onChange={onChange}
                options={[
                  {
                    id: "default",
                    label: t("page.share.form.type.default.label"),
                    value: "default",
                  },
                  {
                    id: "custom",
                    label: t("page.share.form.type.custom.label"),
                    value: "custom",
                  },
                ]}
              />
            )}
          />
          <Paragraph styles={{ font: "body-small" }}>
            <Switch
              data={type}
              default={t("page.share.form.type.default.description")}
              custom={t("page.share.form.type.custom.description")}
            />
          </Paragraph>
          {type === "custom" && (
            <Stack>
              {fields.map((item, index) => (
                <ShareItem
                  key={item.id}
                  item={item}
                  onDelete={() => remove(index)}
                />
              ))}
              {showAddForm ? (
                <AddShareItemForm event={event} onAdd={addPeriod} />
              ) : (
                <Container
                  styles={{
                    padding: "s",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    background: "transparent",
                  }}
                >
                  <Button
                    onClick={() => setShowAddForm(true)}
                    label={t(
                      "page.share.form.type.custom.actions.showAddForm",
                      {
                        count: fields.length,
                      }
                    )}
                    variant="tertiary"
                    icon={{ name: "add", position: "start" }}
                  />
                </Container>
              )}
              {formState.errors.shares?.message && (
                <ErrorMessage message={formState.errors.shares?.message} />
              )}
            </Stack>
          )}
        </Stack>
      </Form>
    </Card>
  );
}
