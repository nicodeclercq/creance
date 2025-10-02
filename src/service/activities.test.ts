import { createEvent, createParticipant } from "./test-helpers";
import { describe, expect, it } from "vitest";

import { getPresenceByDays } from "./activities";

describe("getPresenceByDays", () => {
  it("should return the presence by days for a default participation", () => {
    const user1 = createParticipant({
      share: { adults: 1, children: 2 },
    });

    const event = createEvent({
      period: {
        start: new Date("2025-01-01"),
        arrival: "PM",
        end: new Date("2025-01-06"),
        departure: "AM",
      },
      participants: {
        [user1._id]: user1,
      },
    });

    const presenceByDays = getPresenceByDays(event);

    expect(presenceByDays).toStrictEqual({
      "2025-1-1": {
        dinner: { adults: 1, children: 2 },
      },
      "2025-1-2": {
        lunch: { adults: 1, children: 2 },
        dinner: { adults: 1, children: 2 },
      },
      "2025-1-3": {
        lunch: { adults: 1, children: 2 },
        dinner: { adults: 1, children: 2 },
      },
      "2025-1-4": {
        lunch: { adults: 1, children: 2 },
        dinner: { adults: 1, children: 2 },
      },
      "2025-1-5": {
        lunch: { adults: 1, children: 2 },
        dinner: { adults: 1, children: 2 },
      },
      "2025-1-6": {
        lunch: { adults: 1, children: 2 },
      },
    });
  });

  it("should return the presence by days for a daily participation", () => {
    const user1 = createParticipant({
      participantShare: {
        type: "daily",
        periods: {
          "2025-1-1": {
            PM: { adults: 1, children: 1 },
          },
          "2025-1-2": {
            AM: { adults: 2, children: 1 },
            PM: { adults: 1, children: 1 },
          },
          "2025-1-5": {
            AM: { adults: 3, children: 2 },
            PM: { adults: 2, children: 2 },
          },
          "2025-1-6": {
            AM: { adults: 0, children: 3 },
          },
        },
      },
    });

    const event = createEvent({
      period: {
        start: new Date("2025-01-01"),
        arrival: "PM",
        end: new Date("2025-01-06"),
        departure: "AM",
      },
      participants: {
        [user1._id]: user1,
      },
    });

    const presenceByDays = getPresenceByDays(event);

    expect(presenceByDays).toStrictEqual({
      "2025-1-1": {
        dinner: { adults: 1, children: 1 },
      },
      "2025-1-2": {
        lunch: { adults: 2, children: 1 },
        dinner: { adults: 1, children: 1 },
      },
      "2025-1-3": {},
      "2025-1-4": {},
      "2025-1-5": {
        lunch: { adults: 3, children: 2 },
        dinner: { adults: 2, children: 2 },
      },
      "2025-1-6": {
        lunch: { adults: 0, children: 3 },
      },
    });
  });

  it("should return the presence by days for all participants", () => {
    const user1 = createParticipant({
      share: { adults: 1, children: 0 },
    });
    const user2 = createParticipant({
      participantShare: {
        type: "daily",
        periods: {
          "2025-1-1": {
            PM: { adults: 1, children: 1 },
          },
          "2025-1-2": {
            AM: { adults: 2, children: 1 },
            PM: { adults: 1, children: 1 },
          },
          "2025-1-5": {
            AM: { adults: 3, children: 2 },
            PM: { adults: 2, children: 2 },
          },
          "2025-1-6": {
            AM: { adults: 0, children: 3 },
          },
        },
      },
    });

    const event = createEvent({
      period: {
        start: new Date("2025-01-01"),
        arrival: "PM",
        end: new Date("2025-01-06"),
        departure: "AM",
      },
      participants: {
        [user1._id]: user1,
        [user2._id]: user2,
      },
    });

    const presenceByDays = getPresenceByDays(event);

    expect(presenceByDays).toStrictEqual({
      "2025-1-1": {
        dinner: { adults: 2, children: 1 },
      },
      "2025-1-2": {
        lunch: { adults: 3, children: 1 },
        dinner: { adults: 2, children: 1 },
      },
      "2025-1-3": {
        dinner: {
          adults: 1,
          children: 0,
        },
        lunch: {
          adults: 1,
          children: 0,
        },
      },
      "2025-1-4": {
        dinner: {
          adults: 1,
          children: 0,
        },
        lunch: {
          adults: 1,
          children: 0,
        },
      },
      "2025-1-5": {
        lunch: { adults: 4, children: 2 },
        dinner: { adults: 3, children: 2 },
      },
      "2025-1-6": {
        lunch: { adults: 1, children: 3 },
      },
    });
  });
});
