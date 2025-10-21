import { Controller, useForm } from "react-hook-form";
import { DAYS_BEFORE_CLOSE, eventSchema } from "../../../models/Event";

import { CalendarRangePicker } from "../../../ui/FormField/CalendarRangePicker/CalendarRangePicker";
import { Checkbox } from "../../../ui/FormField/Checkbox/Checkbox";
import type { Event } from "../../../models/Event";
import { Form } from "../../../ui/Form/Form";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { periodSchema } from "../../../models/Period";
import { useData } from "../../../store/useData";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createStep1DataSchema = (
  t: ReturnType<typeof useTranslation>["t"],
  events: Record<string, Event>
) =>
  z.object({
    name: eventSchema.shape.name
      .min(
        3,
        t("page.events.add.form.field.name.validation.minLength", { min: 3 })
      )
      .refine(
        (value) =>
          !Object.values(events).some(
            (event) => event.name.toLowerCase() === value.toLowerCase()
          ),
        t("page.events.add.form.field.name.validation.isUnique")
      ),
    description: eventSchema.shape.description,
    dates: z.object({
      start: z.date(),
      end: z.date(),
    }),
    arrival: periodSchema.shape.arrival,
    departure: periodSchema.shape.departure,
    isAutoClose: eventSchema.shape.isAutoClose,
  });

export type Step1Data = z.infer<ReturnType<typeof createStep1DataSchema>>;

type AddEventStep1Props = {
  onNext: (data: Step1Data) => void;
  data: Step1Data;
};

export function AddEventStep1({ data, onNext }: AddEventStep1Props) {
  const { t } = useTranslation();
  const [events] = useData("events");
  const { control, handleSubmit, formState } = useForm<Step1Data>({
    defaultValues: data,
    mode: "onBlur",
    resolver: zodResolver(createStep1DataSchema(t, events)),
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
              delay: DAYS_BEFORE_CLOSE,
            })}
            value={value ?? false}
            onChange={onChange}
          />
        )}
      />
    </Form>
  );
}
