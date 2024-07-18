import { useState, useEffect, ReactNode } from "react";
import { FONT } from "../../entities/font";
import { toCssValue, COLOR } from "../../entities/color";
import { Translate } from "../../shared/translate/translate";

const MINUTE = 60;
const HOUR = 60;
const DAY = 24;
const WEEK = 7;

const MINUTE_MS = MINUTE * 1000;
const HOUR_MS = HOUR * MINUTE_MS;
const DAY_MS = DAY * HOUR_MS;

const getDateDiff = (date1: Date, date2: Date, timeUnit: number) =>
  Math.floor((date1.getTime() - date2.getTime()) / timeUnit);
const predicates = [
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, MINUTE_MS),
    predicate: (diff: number) => diff <= 1,
    component: () => <Translate name="date.now" />,
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, MINUTE_MS),
    predicate: (diff: number) => diff <= 2,
    component: () => <Translate name="date.minuteAgo" />,
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, MINUTE_MS),
    predicate: (diff: number) => diff < HOUR,
    component: (value: number) => (
      <Translate name="date.minutesAgo" parameters={{ value }} />
    ),
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, HOUR_MS),
    predicate: (diff: number) => diff <= 2,
    component: () => <Translate name="date.hourAgo" />,
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, HOUR_MS),
    predicate: (diff: number) => diff <= DAY,
    component: (value: number) => (
      <Translate name="date.hoursAgo" parameters={{ value }} />
    ),
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, DAY_MS),
    predicate: (diff: number) => diff <= 2,
    component: () => <Translate name="date.dayAgo" />,
  },
  {
    diff: (now: Date, date: Date) => getDateDiff(now, date, DAY_MS),
    predicate: (diff: number) => diff <= WEEK,
    component: (value: number) => (
      <Translate name="date.daysAgo" parameters={{ value }} />
    ),
  },
  {
    diff: () => 0,
    predicate: (_: number) => true,
    component: (_: number, date: Date) => <>{date.toLocaleDateString()}</>,
  },
];

const findBestPredicate = (date: Date) => {
  const now = new window.Date();

  return predicates.reduce((acc, cur) => {
    if (!acc) {
      const diff = cur.diff(now, date);
      if (cur.predicate(diff)) {
        return cur.component(diff, date);
      }
    }

    return acc;
  }, undefined as ReactNode | undefined);
};

export function Date({ value }: { value: Date | string }) {
  const date = typeof value === "string" ? new window.Date(value) : value;
  const [child, setChild] = useState(findBestPredicate(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setChild(findBestPredicate(date));
    }, MINUTE_MS / 2);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <span style={{ font: FONT.LABEL, color: toCssValue(COLOR.GREY) }}>
      {child}
    </span>
  );
}
