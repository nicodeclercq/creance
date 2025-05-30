import * as Either from "fp-ts/Either";

import { UserShare } from "../../../models/Event";

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
  type: "default" | "custom";
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
};

export const toShare = (data: FormShare): Either.Either<Error, UserShare> => {
  switch (data.type) {
    case "default":
      return Either.right({
        type: "default",
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

export const fromShare = (data: UserShare): FormShare => {
  return {
    type: data.type,
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
