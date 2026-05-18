import { Controller, useForm } from "react-hook-form";
import { DAYS_BEFORE_CLOSE, eventSchema } from "../../../models/Event";

import type { ButtonProps } from "../../../ui/Button/Button";
import { CalendarRangePicker } from "../../../ui/FormField/CalendarRangePicker/CalendarRangePicker";
import { Checkbox } from "../../../ui/FormField/Checkbox/Checkbox";
import { ConfirmDialog } from "../../../ui/ConfirmDialog/ConfirmDialog";
import type { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import type { Event } from "../../../models/Event";
import { Form } from "../../../ui/Form/Form";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { periodSchema } from "../../../models/Period";
import { useData } from "../../../store/useData";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createStep1DataSchema = (
  t: ReturnType<typeof useTranslation>["t"],
  events: Record<string, Event>,
  excludeEventId?: string,
) =>
  z.object({
    name: eventSchema.shape.name
      .min(
        3,
        t("page.events.add.form.field.name.validation.minLength", { min: 3 }),
      )
      .refine(
        (value) =>
          !Object.values(events).some(
            (event) =>
              event._id !== excludeEventId &&
              event.name.toLowerCase() === value.toLowerCase(),
          ),
        t("page.events.add.form.field.name.validation.isUnique"),
      ),
    description: eventSchema.shape.description,
    dates: z.object({
      start: z.date(),
      end: z.date(),
    }),
    arrival: periodSchema.shape.arrival,
    departure: periodSchema.shape.departure,
    isAutoClose: eventSchema.shape.isAutoClose,
    hasProgram: eventSchema.shape.hasProgram,
  });

export type Step1Data = z.infer<ReturnType<typeof createStep1DataSchema>>;

type EventStep1FormProps = {
  defaultValues: Step1Data;
  onSubmit: (data: Step1Data) => void;
  submitLabel: string;
  cancel: DistributiveOmit<ButtonProps, "variant">;
  excludeEventId?: string;
};

const isPeriodReduced = (original: Step1Data, updated: Step1Data): boolean => {
  const originalStart = original.dates.start.getTime();
  const originalEnd = original.dates.end.getTime();
  const updatedStart = updated.dates.start.getTime();
  const updatedEnd = updated.dates.end.getTime();

  return updatedStart > originalStart || updatedEnd < originalEnd;
};

export function EventStep1Form({
  defaultValues,
  onSubmit,
  submitLabel,
  cancel,
  excludeEventId,
}: EventStep1FormProps) {
  const { t } = useTranslation();
  const [events] = useData("events");
  const [pendingData, setPendingData] = useState<Step1Data | null>(null);
  const { control, handleSubmit, formState } = useForm<Step1Data>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(
      createStep1DataSchema(t, events.collection, excludeEventId),
    ),
  });
  const hasError = Object.keys(formState.errors).length > 0;

  const handleFormSubmit = (data: Step1Data) => {
    // If excludeEventId exists, we're editing, so check if period is reduced
    if (excludeEventId && isPeriodReduced(defaultValues, data)) {
      setPendingData(data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <>
      <Form
        hasError={hasError}
        handleSubmit={handleSubmit}
        submit={{
          label: submitLabel,
          onClick: handleFormSubmit,
        }}
        cancel={cancel}
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
          name="hasProgram"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label={t("page.events.add.form.field.hasProgram.label")}
              value={value ?? false}
              onChange={onChange}
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
      <ConfirmDialog
        title={t("EventStep1Form.confirmation.title")}
        description={t("EventStep1Form.confirmation.description")}
        isOpen={pendingData !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingData(null);
          }
        }}
        cancel={{
          label: t("EventStep1Form.confirmation.cancel"),
          onClick: () => setPendingData(null),
        }}
        confirm={{
          label: t("EventStep1Form.confirmation.confirm"),
          onClick: () => {
            if (pendingData) {
              onSubmit(pendingData);
              setPendingData(null);
            }
          },
        }}
      />
    </>
  );
}
