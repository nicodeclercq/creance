export function dateToKey(day: Date | undefined) {
  if (!day) {
    return "";
  }

  return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
}

export function addTimeToDate(date: Date, time: string) {
  if (!time) {
    return date;
  }
  const parts = time.split(":");

  if (parts.length !== 2) {
    return date;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  const result = new Date(date.valueOf());
  result.setHours(Number(hours), Number(minutes), 0, 0);
  return result;
}

export const addDays = (nb: number, date: Date = new Date()) => {
  const result = new Date(date.valueOf());
  result.setDate(date.getDate() + nb);
  return result;
};

export const sortByDate =
  <K extends string, T extends { [k in K]: Date }>(
    k: K,
    direction: "asc" | "desc" = "asc"
  ) =>
  (a: T, b: T) => {
    return direction === "desc" ? sort(b[k], a[k]) : sort(a[k], b[k]);
  };

export const sort = (a: Date, b: Date) => (a < b ? -1 : a > b ? 1 : 0);

export const isBefore = (a: Date) => (b: Date) => b.getTime() < a.getTime();
export const isAfter = (a: Date) => (b: Date) => b.getTime() > a.getTime();
export const isBetween = (start: Date, end: Date) => (c: Date) =>
  isBefore(start)(c) && isAfter(end)(c);
export const isInInterval =
  (a: { start: Date; end: Date }) => (b: { start: Date; end: Date }) =>
    isBefore(a.start)(b.start) && isAfter(a.end)(b.end);

export const isTimeBefore = (a: string, b: string) => {
  const aParts = a.split(":");
  const bParts = b.split(":");
  if (aParts.length !== 2 || bParts.length !== 2) {
    return false;
  }

  return (
    Number(aParts[0]) < Number(bParts[0]) ||
    (Number(aParts[0]) === Number(bParts[0]) &&
      Number(aParts[1]) < Number(bParts[1]))
  );
};

export const getTimeGap = (
  time1: string,
  time2: string
): { hours: number; minutes: number } => {
  const time1Parts = time1.split(":");
  const time2Parts = time2.split(":");
  if (time1Parts.length !== 2 || time2Parts.length !== 2) {
    return { hours: 0, minutes: 0 };
  }

  return {
    hours:
      Number.parseInt(time1Parts[0], 10) - Number.parseInt(time2Parts[0], 10),
    minutes:
      Number.parseInt(time1Parts[1], 10) - Number.parseInt(time2Parts[1], 10),
  };
};

export const addTime = (
  time: string,
  { minutes = 0, hours = 0 }: { minutes?: number; hours?: number }
) => {
  const parts = time.split(":");
  if (parts.length !== 2) {
    return time;
  }

  const newHours = Number.parseInt(parts[0], 10) + hours;
  const newMinutes = Number.parseInt(parts[1], 10) + minutes;

  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
};
