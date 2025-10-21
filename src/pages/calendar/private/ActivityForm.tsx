import { addTime, addTimeToDate, getTimeGap } from "../../../utils/date";
import { useEffect, useRef, useState } from "react";

import type { Activity } from "../../../models/Activity";
import { Bleed } from "../../../ui/Bleed/Bleed";
import type { ButtonProps } from "../../../ui/Button/Button";
import { Checkbox } from "../../../ui/FormField/Checkbox/Checkbox";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { Controller } from "react-hook-form";
import type { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import { Form } from "../../../ui/Form/Form";
import { InputDate } from "../../../ui/FormField/InputDate/InputDate";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { InputTime } from "../../../ui/FormField/InputTime/InputTime";
import { LoadingIcon } from "../../../ui/Button/LoadingIcon";
import { Stack } from "../../../ui/Stack/Stack";
import { activitySchema } from "../../../models/Activity";
import { uid } from "../../../service/crypto";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type ActivityFormProps = {
  defaultValue: Activity;
  submitLabel: string;
  onSubmit: (activity: Activity) => void;
  cancel: DistributiveOmit<ButtonProps, "variant">;
};

const activityFormSchema = z.object({
  image: activitySchema.shape.image,
  name: activitySchema.shape.name,
  description: activitySchema.shape.description,
  isAllDay: activitySchema.shape.isAllDay,
  date: z.date(),
  startTime: z.string(),
  endTime: z.string().optional(),
  url: activitySchema.shape.url,
  reservationRequired: activitySchema.shape.reservationRequired,
});

type FormActivity = z.infer<typeof activityFormSchema>;

const getURLImage = (url: string): Promise<string | undefined> => {
  // Use CORS proxy to fetch the website
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    url
  )}`;

  return fetch(proxyUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      doc.querySelectorAll("script, body").forEach((script) => {
        script.remove();
      });

      const selectors = [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[name="image"]',
        'link[rel="icon"][sizes="512x512"]',
        'link[rel="icon"][sizes="192x192"]',
        'link[rel="icon"][sizes="64x64"]',
        'link[rel="icon"][sizes="48x48"]',
        'link[rel="icon"][sizes="32x32"]',
        'link[rel="icon"][sizes="16x16"]',
        'link[rel="shortcut icon"]',
      ];

      const images = selectors
        .map((selector) => doc.querySelector(selector))
        .filter(Boolean)
        .map(
          (image) =>
            image?.getAttribute("content") ?? image?.getAttribute("href")
        );

      const imageUrl = images[0];

      if (imageUrl) {
        return new URL(imageUrl, url).toString();
      }
    })
    .catch((e) => {
      const newURL = new URL(url).origin;

      if (newURL !== url) {
        return getURLImage(newURL);
      } else {
        throw e;
      }
    });
};

const formActivityToActivity = (
  formActivity: FormActivity,
  proposedBy: string,
  id?: string
): Activity => {
  const startDate = addTimeToDate(formActivity.date, formActivity.startTime);
  const endDate = formActivity.endTime
    ? addTimeToDate(formActivity.date, formActivity.endTime)
    : undefined;
  return {
    _id: id ?? uid(),
    description: formActivity.description,
    name: formActivity.name,
    isAllDay: formActivity.isAllDay,
    reservationRequired: formActivity.reservationRequired,
    startDate,
    endDate,
    url: formActivity.url,
    image: formActivity.image,
    proposedBy: proposedBy,
    updatedAt: new Date(),
  };
};

const activityToFormActivity = (activity: Activity): FormActivity => {
  const startTime = `${activity.startDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${activity.startDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const endTime = activity.endDate
    ? `${activity.endDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${activity.endDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : undefined;

  return {
    image: activity.image,
    description: activity.description,
    name: activity.name,
    isAllDay: activity.isAllDay,
    reservationRequired: activity.reservationRequired,
    date: activity.startDate,
    url: activity.url,
    startTime,
    endTime: endTime === startTime ? addTime(startTime, { hours: 1 }) : endTime,
  };
};

export function ActivityForm({
  defaultValue,
  onSubmit,
  submitLabel,
  cancel,
}: ActivityFormProps) {
  const isMounted = useRef(false);
  const { t } = useTranslation();
  const loadingImagePromise = useRef<Promise<string | undefined> | undefined>(
    undefined
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm(activityFormSchema, {
    defaultValues: activityToFormActivity(defaultValue),
    mode: "onChange",
  });
  const isAllDay = watch("isAllDay");
  const image = watch("image");

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const hasError = Object.keys(errors).length > 0;

  const submit = (data: FormActivity) => {
    if (loadingImagePromise.current) {
      return loadingImagePromise.current.then((image) => {
        const newActivity = formActivityToActivity(
          { ...data, image },
          defaultValue.proposedBy,
          defaultValue._id
        );
        return onSubmit(newActivity);
      });
    } else {
      const newActivity = formActivityToActivity(
        data,
        defaultValue.proposedBy,
        defaultValue._id
      );

      return onSubmit(newActivity);
    }
  };

  const onUrlChange = (value: string) => {
    if (!value || !value.startsWith("http")) return;
    setIsLoadingImage(true);

    loadingImagePromise.current = getURLImage(value);

    (loadingImagePromise.current as Promise<string | undefined>)
      .then((image) => {
        if (isMounted.current) {
          setValue("image", image);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoadingImage(false);
        }
      });
  };

  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      submit={{
        onClick: submit,
        label: submitLabel,
      }}
      cancel={cancel}
    >
      <Stack gap="m" alignItems="stretch">
        <Container
          styles={{
            gap: "m",
            width: "100%",
            height: "10rem",
            background: "body",
          }}
        >
          {isLoadingImage ? (
            <Container
              styles={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <LoadingIcon size="m" />
            </Container>
          ) : (
            <Bleed
              direction="horizontal"
              width="100%"
              height="inherit"
              spacing={{ horizontal: "4.8rem" }}
            >
              <img
                src={image ?? defaultValue.image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  border: "1px solid transparent",
                }}
              />
            </Bleed>
          )}
        </Container>
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputText
              type="text"
              label={t("ActivityForm.name.label")}
              isRequired
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Columns gap="s" align="center">
          <Controller
            name="date"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputDate
                type="date"
                label={t("ActivityForm.date.label")}
                isRequired
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputTime
                label={t("ActivityForm.startTime.label")}
                isRequired
                value={value}
                onChange={(newValue) => {
                  const endTime = getValues("endTime");
                  if (endTime == null) {
                    // initialize the endTime to 1 hour after the startTime
                    const newEndTime = addTime(newValue, { hours: 1 });
                    setValue("endTime", newEndTime);
                  } else if (endTime != null) {
                    // keep the same gap between startTime and endTime
                    const gap = getTimeGap(endTime, value);
                    const newEndTime = addTime(newValue, gap);
                    setValue("endTime", newEndTime);
                  }
                  onChange(newValue);
                }}
                isDisabled={isAllDay}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputTime
                label={t("ActivityForm.endTime.label")}
                isRequired
                value={value ?? ""}
                onChange={onChange}
                isDisabled={isAllDay}
              />
            )}
          />
        </Columns>
        <Controller
          name="isAllDay"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              label={t("ActivityForm.isAllDay.label")}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="url"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputText
              type="text"
              label={t("ActivityForm.url.label")}
              isRequired
              value={value ?? ""}
              onChange={onChange}
              onBlur={onUrlChange}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputText
              type="text"
              label={t("ActivityForm.description.label")}
              isRequired
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="reservationRequired"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              label={t("ActivityForm.reservationRequired.label")}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </Stack>
    </Form>
  );
}
