import type { Activity } from "../models/Activity";
import type { Event } from "../models/Event";
import { dateToKey } from "../utils/date";

function getDaysInInterval(startDate: Date, endDate: Date) {
  const day = new Date(startDate);

  const days = [];
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return days;
}

export function getActivitiesByDays(event: Event): Record<string, Activity[]> {
  const period = getDaysInInterval(event.period.start, event.period.end);

  return period.reduce((activitiesByDays, day) => {
    const dayString = dateToKey(day);

    if (!(dayString in activitiesByDays)) {
      activitiesByDays[dayString] = [];
    }

    Object.values(event.activities).forEach((activity) => {
      if (
        dateToKey(activity.startDate) === dayString ||
        dateToKey(activity.endDate) === dayString
      ) {
        activitiesByDays[dateToKey(day)].push(activity);
      }
    });

    return activitiesByDays;
  }, {} as Record<string, Activity[]>);
}

export type Presence = {
  lunch?: { adults: number; children: number };
  dinner?: { adults: number; children: number };
};

function concatPresence(presence1: Presence, presence2: Presence) {
  const hasLunch = (presence1.lunch || presence2.lunch) != null;
  const hasDinner = (presence1.dinner || presence2.dinner) != null;

  const lunch = hasLunch
    ? {
        lunch: {
          adults:
            (presence1.lunch?.adults ?? 0) + (presence2.lunch?.adults ?? 0),
          children:
            (presence1.lunch?.children ?? 0) + (presence2.lunch?.children ?? 0),
        },
      }
    : {};
  const dinner = hasDinner
    ? {
        dinner: {
          adults:
            (presence1.dinner?.adults ?? 0) + (presence2.dinner?.adults ?? 0),
          children:
            (presence1.dinner?.children ?? 0) +
            (presence2.dinner?.children ?? 0),
        },
      }
    : {};

  return {
    ...lunch,
    ...dinner,
  };
}

export function getPresenceByDays(event: Event): Record<string, Presence> {
  const period = getDaysInInterval(event.period.start, event.period.end);

  return period.reduce(
    (presenceByDays, day) =>
      Object.values(event.participants).reduce(
        (presenceByDays, participant) => {
          const dayString = dateToKey(day);
          if (!(dayString in presenceByDays)) {
            presenceByDays[dayString] = {};
          }

          switch (participant.participantShare.type) {
            case "default":
              const lunch =
                dayString === dateToKey(event.period.start) &&
                event.period.arrival === "PM"
                  ? {}
                  : {
                      lunch: {
                        adults: participant.share.adults,
                        children: participant.share.children,
                      },
                    };
              const dinner =
                dayString === dateToKey(event.period.end) &&
                event.period.departure === "AM"
                  ? {}
                  : {
                      dinner: {
                        adults: participant.share.adults,
                        children: participant.share.children,
                      },
                    };

              presenceByDays[dayString] = concatPresence(
                presenceByDays[dayString],
                {
                  ...lunch,
                  ...dinner,
                }
              );
              break;
            case "daily":
              presenceByDays[dayString] = concatPresence(
                presenceByDays[dayString],
                {
                  lunch: participant.participantShare.periods[dayString]?.AM,
                  dinner: participant.participantShare.periods[dayString]?.PM,
                }
              );

              break;
          }

          return presenceByDays;
        },
        presenceByDays
      ),
    {} as Record<string, Presence>
  );
}
