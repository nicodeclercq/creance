import { Controller, useForm } from "react-hook-form";

import { CalendarRangePicker } from "../../../ui/FormField/CalendarRangePicker/CalendarRangePicker";
import { Checkbox } from "../../../ui/FormField/Checkbox/Checkbox";
import { Form } from "../../../ui/Form/Form";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { useStore } from "../../../store/StoreProvider";
import { useTranslation } from "react-i18next";

const DELAY_BEFORE_CLOSE = 7;

export type Step1Data = {
  name: string;
  description: string;
  dates: {
    start: Date;
    end: Date;
  };
  arrival: "AM" | "PM";
  departure: "AM" | "PM";
  isAutoClose: boolean;
};

type AddEventStep1Props = {
  onNext: (data: Step1Data) => void;
  data: Step1Data;
};

export function AddEventStep1({ data, onNext }: AddEventStep1Props) {
  const { t } = useTranslation();
  const [events] = useStore("events");
  const { control, handleSubmit, formState } = useForm<Step1Data>({
    defaultValues: data,
    mode: "onBlur",
  });
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
        as: "link",
        label: t("page.events.add.form.cancel"),
        to: "EVENT_LIST",
      }}
    >
      <Controller
        name="name"
        control={control}
        rules={{
          required: t("page.events.add.form.field.name.validation.required"),
          minLength: {
            value: 3,
            message: t("page.events.add.form.field.name.validation.minLength", {
              min: 3,
            }),
          },
          validate: {
            isUnique: (value) => {
              const isUnique = !Object.values(events).some(
                (events) => events.name === value
              );
              return (
                isUnique ||
                t("page.events.add.form.field.name.validation.isUnique")
              );
            },
          },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <InputText
            type="text"
            label={t("page.events.add.form.field.name.label")}
            value={value}
            onChange={onChange}
            isRequired
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{
          maxLength: {
            value: 128,
            message: t(
              "page.events.add.form.field.description.validation.maxLength",
              {
                max: 128,
              }
            ),
          },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <InputText
            type="text"
            label={t("page.events.add.form.field.description.label")}
            value={value}
            onChange={onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="dates"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CalendarRangePicker
            type="calendar-range-picker"
            label={t("page.events.add.form.field.dates.label")}
            value={value}
            onChange={onChange}
            isRequired
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
      <Controller
        name="isAutoClose"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            label={t("page.events.add.form.field.isAutoClose.label", {
              delay: DELAY_BEFORE_CLOSE,
            })}
            value={value}
            onChange={onChange}
          />
        )}
      />
    </Form>
  );
}
