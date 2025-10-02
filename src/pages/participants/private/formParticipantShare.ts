import * as Either from "fp-ts/Either";

import { addDays, dateToKey } from "../../../utils/date";

import { Event } from "../../../models/Event";
import { ParticipantShare } from "../../../models/ParticipantShare";
import { Period } from "../../../models/Period";
import { User } from "../../../models/User";

export type CustomShare = {
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

export type FormShare = {
  type: "default" | "custom" | "daily";
  shares: {
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
  }[];
  periods: {
    [date: string]: {
      AM?: {
        adults: number;
        children: number;
      };
      PM?: {
        adults: number;
        children: number;
      };
    };
  };
};

export const toShare = (
  data: FormShare
): Either.Either<Error, ParticipantShare> => {
  switch (data.type) {
    case "default":
      return Either.right({
        type: "default",
      });

    case "daily":
      return Either.right({
        type: "daily",
        periods: data.periods,
      });

    case "custom":
      return Either.right({
        type: "custom",
        shares: data.shares.map((share) => ({
          label: share.label,
          multiplier: {
            adults: share.multiplier.adults,
            children: share.multiplier.children,
          },
          period: {
            start: share.period.start,
            end: share.period.end,
            arrival: share.arrival,
            departure: share.departure,
          },
        })),
      });
  }
};

export const getDaysInPeriod = (period: Period): Date[] => {
  return Array.from(
    { length: period.end.getDate() - period.start.getDate() + 1 },
    (_, i) => addDays(i, period.start)
  );
};

export const getDefaultPeriods = (
  defaultPeriods: FormShare["periods"],
  event: Event,
  user: User
): FormShare["periods"] => {
  const adults = user.share.adults;
  const children = user.share.children;
  const defaultValues = { AM: { adults, children }, PM: { adults, children } };
  return getDaysInPeriod(event.period).reduce((acc, cur) => {
    const key = dateToKey(cur);
    if (
      event.period.arrival === "PM" &&
      dateToKey(event.period.start) === key
    ) {
      acc[key] = {
        PM: defaultPeriods[key]?.["PM"] ?? defaultValues["PM"],
      };
    } else if (
      event.period.departure === "AM" &&
      dateToKey(event.period.end) === key
    ) {
      acc[key] = { AM: defaultPeriods[key]?.["AM"] ?? defaultValues["AM"] };
    } else {
      acc[key] = defaultPeriods[key] ?? defaultValues;
    }

    return acc;
  }, {} as FormShare["periods"]);
};

export const fromShare = (
  data: ParticipantShare,
  event: Event,
  user: User
): FormShare => {
  return {
    type: data.type,
    periods: getDefaultPeriods(
      "periods" in data ? data.periods : {},
      event,
      user
    ),
    shares:
      "shares" in data
        ? data.shares.map((share) => ({
            label: share.label,
            multiplier: {
              adults: share.multiplier.adults,
              children: share.multiplier.children,
            },
            period: {
              start: share.period.start,
              end: share.period.end,
            },
            arrival: share.period.arrival,
            departure: share.period.departure,
          }))
        : [],
  };
};
