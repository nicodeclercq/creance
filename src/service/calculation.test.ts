import * as Either from "fp-ts/Either";

import { describe, expect, it } from "vitest";
import {
  getCustomParticipantShareCount,
  getDefaultParticipantShareCount,
  getEventDistribution,
  getEventSharesByParticipant,
  getExpenseAmountByCategory,
  getExpenseShares,
  getHalfDaysCount,
  getTotalExpenseAmount,
} from "./calculation";

import { CustomParticipantShare } from "../models/ParticipantShare";
import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { Participant } from "../models/Participant";
import { pipe } from "fp-ts/function";
import { uid } from "./crypto";

const createEvent = (defaultValues: Partial<Event> = {}): Event => ({
  _id: uid(),
  name: "Event Name",
  description: "",
  participants: {},
  categories: {
    Food: {
      _id: uid(),
      name: "Food",
      icon: "axe",
    },
    Transport: {
      _id: uid(),
      name: "Transport",
      icon: "axe",
    },
  },
  deposits: {},
  expenses: {},
  isClosed: false,
  period: {
    start: new Date("2025-01-01"), // x1
    arrival: "PM",
    end: new Date("2025-01-01"),
    departure: "PM",
  },
  updatedAt: new Date(),
  ...defaultValues,
});
const createExpense = (defaultValues: Partial<Expense> = {}): Expense => ({
  _id: uid(),
  category: uid(),
  lender: uid(),
  date: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  reason: "Expense Reason",
  amount: "100",
  share: { type: "default" },
  ...defaultValues,
});
const createParticipant = (
  defaultValues: Partial<Participant> = {}
): Participant => ({
  _id: uid(),
  name: "Participant Name",
  share: {
    adults: 1,
    children: 0,
  },
  participantShare: { type: "default" },
  updatedAt: new Date("2025-01-01"),
  ...defaultValues,
});
const createDeposit = (defaultValues: Partial<Deposit> = {}): Deposit => ({
  _id: uid(),
  from: uid(),
  to: uid(),
  amount: "100",
  note: "Deposit Reason",
  date: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  ...defaultValues,
});

describe("calcultation", () => {
  describe("getTotalExpenseAmount", () => {
    it("should return the total amount of expenses", () => {
      const expenses = [
        createExpense({ amount: "50 + 25 * 2" }),
        createExpense({ amount: "200.45" }),
        createExpense({ amount: "300.12" }),
      ];

      expect(getTotalExpenseAmount(expenses)).toStrictEqual(
        Either.right(60057)
      );
    });
  });

  describe("getExpenseAmountByCategory", () => {
    it("should group the amounts by category", () => {
      const expenses = [
        createExpense({ category: "Food", amount: "50 + 25 * 2" }),
        createExpense({ category: "Transport", amount: "200.45" }),
        createExpense({ category: "Food", amount: "300.12" }),
        createExpense({ category: "Transport", amount: "123.01" }),
      ];

      const result = getExpenseAmountByCategory(expenses);

      expect(result).toStrictEqual(
        Either.right({
          Food: 40012,
          Transport: 32346,
        })
      );
    });
  });

  describe("getHalfDaysCount", () => {
    it("should return the count of half days", () => {
      const periods = [
        {
          input: {
            start: new Date("2025-01-01"),
            arrival: "PM",
            end: new Date("2025-01-01"),
            departure: "PM",
          },
          output: 1,
        },
        {
          input: {
            start: new Date("2025-01-01"),
            arrival: "AM",
            end: new Date("2025-01-01"),
            departure: "PM",
          },
          output: 2,
        },
        {
          input: {
            start: new Date("2025-01-01"),
            arrival: "PM",
            end: new Date("2025-01-05"),
            departure: "AM",
          },
          output: 8,
        },
        {
          input: {
            start: new Date("2025-01-01"),
            arrival: "AM",
            end: new Date("2025-01-10"),
            departure: "PM",
          },
          output: 20,
        },
      ] as const;

      periods.forEach((period) => {
        expect(getHalfDaysCount(period.input)).toBe(period.output);
      });
    });
  });

  describe("getDefaultParticipantShareCount", () => {
    it("should return the default share count for a child (*1)", () => {
      const share = getDefaultParticipantShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createParticipant({
          share: { adults: 0, children: 1 },
        })
      );

      expect(share).toBe(8 * 1);
    });
    it("should return the default share count for an adult (*2)", () => {
      const share = getDefaultParticipantShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createParticipant({
          share: { adults: 1, children: 0 },
        })
      );

      expect(share).toBe(8 * 2);
    });
    it("should return the default share count for a group of participants", () => {
      const share = getDefaultParticipantShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createParticipant({
          share: { adults: 2, children: 1 },
        })
      );

      expect(share).toBe(8 * (4 + 1));
    });
  });

  describe("getCustomParticipantShareCount", () => {
    it("should return the custom share count for a participant", () => {
      const customShares: CustomParticipantShare = {
        type: "custom",
        shares: [
          {
            label: "Share 1",
            multiplier: { adults: 1, children: 0 }, // x2
            period: {
              start: new Date("2025-01-01"), // x8
              end: new Date("2025-01-05"),
              arrival: "PM",
              departure: "AM",
            },
          },
          {
            label: "Share 2",
            multiplier: { adults: 0, children: 1 }, // x1
            period: {
              start: new Date("2025-01-02"), // X2
              end: new Date("2025-01-03"),
              arrival: "PM",
              departure: "AM",
            },
          },
          {
            label: "Share 3",
            multiplier: { adults: 1, children: 1 }, // x3
            period: {
              start: new Date("2025-01-01"), // X6
              end: new Date("2025-01-03"),
              arrival: "AM",
              departure: "PM",
            },
          },
        ],
      };

      const share = getCustomParticipantShareCount(customShares);

      expect(share).toBe(8 * 2 + 2 * 1 + 6 * 3);
    });
  });

  describe("getExpenseShares", () => {
    it("should return the default shares by participant", () => {
      const expense = createExpense({
        amount: "300",
        lender: "participant1",
      });
      const event = createEvent({
        participants: {
          participant1: createParticipant({
            _id: "participant1",
            share: { adults: 2, children: 0 },
            participantShare: { type: "default" },
          }),
          participant2: createParticipant({
            _id: "participant2",
            share: { adults: 0, children: 1 },
            participantShare: { type: "default" },
          }),
        },
        expenses: { [expense._id]: expense },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, event })).toStrictEqual(
        Either.right({
          participant1: 24000,
          participant2: 6000,
        })
      );
    });

    it("should return the proportianal shares by participant", () => {
      const expense = createExpense({
        amount: "80",
        lender: "participant1",
        share: {
          type: "percentage",
          distribution: {
            participant1: "25",
            participant2: "75",
          },
        },
      });
      const event = createEvent({
        participants: {
          participant1: createParticipant({
            _id: "participant1",
            participantShare: { type: "default" },
          }),
          participant2: createParticipant({
            _id: "participant2",
            participantShare: { type: "default" },
          }),
        },
        expenses: { [expense._id]: expense },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, event })).toStrictEqual(
        Either.right({
          participant1: 2000,
          participant2: 6000,
        })
      );
    });

    it("should return the fixed shares by participant", () => {
      const expense = createExpense({
        amount: "100",
        lender: "participant1",
        share: {
          type: "fixed",
          distribution: {
            participant1: "25",
            participant2: "75",
          },
        },
      });
      const event = createEvent({
        participants: {
          participant1: createParticipant({
            _id: "participant1",
            participantShare: { type: "default" },
          }),
          participant2: createParticipant({
            _id: "participant2",
            participantShare: { type: "default" },
          }),
        },
        expenses: { [expense._id]: expense },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, event })).toStrictEqual(
        Either.right({
          participant1: 2500,
          participant2: 7500,
        })
      );
    });
  });

  describe("getEventSharesByParticipant", () => {
    it("should add the deposit as an expense for the donator and as a negative expense for the reciever", () => {
      const participants = {
        participant1: createParticipant({
          _id: "participant1",
          participantShare: { type: "default" },
        }),
        participant2: createParticipant({
          _id: "participant2",
          participantShare: { type: "default" },
        }),
        participant3: createParticipant({
          _id: "participant3",
          participantShare: { type: "default" },
        }),
      };
      const deposits = {
        deposit1: createDeposit({
          _id: "deposit1",
          from: "participant1",
          to: "participant2",
          amount: "100",
        }),
        deposit2: createDeposit({
          _id: "deposit2",
          from: "participant2",
          to: "participant3",
          amount: "50",
        }),
        deposit3: createDeposit({
          _id: "deposit3",
          from: "participant3",
          to: "participant1",
          amount: "25",
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "participant1",
          amount: "100",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "participant2",
          amount: "50",
          share: { type: "default" },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "participant3",
          amount: "25",
          share: { type: "default" },
        }),
      };

      const event = createEvent({
        participants,
        deposits: {
          [deposits.deposit1._id]: deposits.deposit1,
          [deposits.deposit2._id]: deposits.deposit2,
          [deposits.deposit3._id]: deposits.deposit3,
        },
        expenses: {
          expense1: expenses.expense1,
          expense2: expenses.expense2,
          expense3: expenses.expense3,
        },
      });

      const participant1Shares = getEventSharesByParticipant({
        event,
        participantId: "participant1",
      });

      expect(
        pipe(
          participant1Shares,
          Either.map((shares) =>
            shares.map((share) => ({
              type: share.type,
              amount: share.amount,
              category: share.category,
            }))
          )
        )
      ).toStrictEqual(
        Either.right([
          {
            type: "expense",
            amount: "100",
            category: "Transport",
          },
          {
            type: "expense",
            amount: "50",
            category: "Food",
          },
          {
            type: "expense",
            amount: "25",
            category: "Food",
          },
        ])
      );
    });

    it("should filter out the expenses that the participant does not have to pay", () => {
      const participants = {
        participant1: createParticipant({
          _id: "participant1",
          participantShare: { type: "default" },
        }),
        participant2: createParticipant({
          _id: "participant2",
          participantShare: { type: "default" },
        }),
        participant3: createParticipant({
          _id: "participant3",
          participantShare: { type: "default" },
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "participant1",
          amount: "100",
          share: {
            type: "fixed",
            distribution: {
              participant1: "50",
              participant2: "0",
              participant3: "50",
            },
          },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "participant2",
          amount: "50",
          share: {
            type: "fixed",
            distribution: {
              participant1: "0",
              participant2: "0",
              participant3: "50",
            },
          },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "participant3",
          amount: "25",
          share: {
            type: "fixed",
            distribution: {
              participant1: "25",
              participant2: "0",
              participant3: "0",
            },
          },
        }),
      };

      const event = createEvent({
        participants,
        expenses: {
          expense1: expenses.expense1,
          expense2: expenses.expense2,
          expense3: expenses.expense3,
        },
      });

      const participant1Shares = getEventSharesByParticipant({
        event,
        participantId: "participant1",
      });

      expect(
        pipe(
          participant1Shares,
          Either.map((shares) =>
            shares.map((share) => ({
              type: share.type,
              amount: share.amount,
              category: share.category,
            }))
          )
        )
      ).toStrictEqual(
        Either.right([
          {
            type: "expense",
            amount: "100",
            category: "Transport",
          },
          {
            type: "expense",
            amount: "25",
            category: "Food",
          },
        ])
      );
    });
  });

  describe("getEventDistribution", () => {
    it("should return the distribution of the event", () => {
      const participants = {
        participant1: createParticipant({
          _id: "participant1",
          participantShare: { type: "default" },
        }),
        participant2: createParticipant({
          _id: "participant2",
          participantShare: { type: "default" },
        }),
        participant3: createParticipant({
          _id: "participant3",
          participantShare: { type: "default" },
        }),
        participant4: createParticipant({
          _id: "participant4",
          participantShare: { type: "default" },
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "participant1",
          amount: "100",
          share: {
            type: "fixed",
            distribution: {
              participant1: "40",
              participant2: "10",
              participant3: "20",
              participant4: "30",
            },
          },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "participant2",
          amount: "50",
          share: {
            type: "fixed",
            distribution: {
              participant1: "10",
              participant2: "10",
              participant3: "10",
              participant4: "20",
            },
          },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "participant3",
          amount: "25",
          share: {
            type: "fixed",
            distribution: {
              participant1: "5",
              participant2: "5",
              participant3: "5",
              participant4: "10",
            },
          },
        }),
      };

      const event = createEvent({
        participants,
        expenses: {
          expense1: expenses.expense1,
          expense2: expenses.expense2,
          expense3: expenses.expense3,
        },
      });

      const distribution = getEventDistribution({
        event,
      });

      expect(distribution).toStrictEqual(
        Either.right({
          participant1: [
            {
              type: "receive",
              amount: 3500,
              participant: "participant4",
            },
            {
              type: "receive",
              amount: 1000,
              participant: "participant3",
            },
          ],
          participant2: [
            {
              type: "receive",
              amount: 2500,
              participant: "participant4",
            },
          ],
          participant3: [
            {
              type: "give",
              amount: 1000,
              participant: "participant1",
            },
          ],
          participant4: [
            {
              type: "give",
              amount: 2500,
              participant: "participant2",
            },
            {
              type: "give",
              amount: 3500,
              participant: "participant1",
            },
          ],
        })
      );
    });

    it("should return the distribution of the event with default shares", () => {
      /*
       * participant1 has 4 shares (adults: 2, children: 0)
       * participant2 has 1 share (adults: 0, children: 1)
       * participant3 has 2 shares (adults: 1, children: 0)
       * participant4 has 3 shares (adults: 1, children: 1)
       * Total: 10 shares
       *
       * participant1 pays 100 and consumes 40 (4/10 * 100) → should receive 60
       * participant2 pays 50 and consumes 10 (1/10 * 100) → should receive 40
       * participant3 pays 25 and consumes 20 (2/10 * 100) → should give 5
       * participant4 pays 0 and consumes 30 (3/10 * 100) → should give 30
       *
       * Shares: 8 (4+1+2+1)
       * Period: 2 half-days
       * participant1: 4 * 2 = 8 shares
       * participant2: 1 * 2 = 2 shares
       * participant3: 2 * 2 = 4 shares
       * participant4: 3 * 2 = 6 shares
       * Total: 20 shares
       *
       * participant1 pays 100 and consumes 70 (8/20 * 175) → should receive 30
       * participant2 pays 50 and consumes 17.5 (2/20 * 175) → should receive 32.5
       * participant3 pays 25 and consumes 35 (4/20 * 175) → should give 10
       * participant4 pays 0 and consumes 52.5 (6/20 * 175) → should give 52.5
       */
      const participants = {
        participant1: createParticipant({
          _id: "participant1",
          share: { adults: 2, children: 0 },
          participantShare: { type: "default" },
        }),
        participant2: createParticipant({
          _id: "participant2",
          share: { adults: 0, children: 1 },
          participantShare: { type: "default" },
        }),
        participant3: createParticipant({
          _id: "participant3",
          share: { adults: 1, children: 0 },
          participantShare: { type: "default" },
        }),
        participant4: createParticipant({
          _id: "participant4",
          share: { adults: 1, children: 1 },
          participantShare: { type: "default" },
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "participant1",
          amount: "100",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "participant2",
          amount: "50",
          share: { type: "default" },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "participant3",
          amount: "25",
          share: { type: "default" },
        }),
      };

      const event = createEvent({
        participants,
        expenses: {
          expense1: expenses.expense1,
          expense2: expenses.expense2,
          expense3: expenses.expense3,
        },
        period: {
          start: new Date("2025-01-01"),
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      const distribution = getEventDistribution({
        event,
      });

      expect(distribution).toStrictEqual(
        Either.right({
          participant1: [
            {
              type: "receive",
              amount: 3000,
              participant: "participant4",
            },
          ],
          participant2: [
            {
              type: "receive",
              amount: 2250,
              participant: "participant4",
            },
            {
              type: "receive",
              amount: 1000,
              participant: "participant3",
            },
          ],
          participant3: [
            {
              type: "give",
              amount: 1000,
              participant: "participant2",
            },
          ],
          participant4: [
            {
              type: "give",
              amount: 3000,
              participant: "participant1",
            },
            {
              type: "give",
              amount: 2250,
              participant: "participant2",
            },
          ],
        })
      );
    });

    it("should return the distribution of the event with custom shares", () => {
      /*
       * participant1 has a custom share period: 16 shares (8 * 2)
       * participant2 has a custom share period: 3 shares (2 * 1 + 1 * 1)
       * participant3 has a custom share period: 2 shares (1 * 2)
       * participant4 has a custom share period: 3 shares (1 * 1 + 1 * 2)
       * Total: 24 shares
       *
       * participant1 pays 100 and consumes 116.67 (16/24 * 175) → should give 16.67
       * participant2 pays 50 and consumes 21.88 (3/24 * 175) → should receive 28.13
       * participant3 pays 25 and consumes 14.58 (2/24 * 175) → should receive 10.42
       * participant4 pays 0 and consumes 21.88 (3/24 * 175) → should give 21.88
       *
       * Shares: 16 (8+3+2+3)
       * Period: 2 half-days
       * participant1: 8 * 2 = 16 shares
       * participant2: 3 shares
       * participant3: 2 shares
       * participant4: 3 shares
       * Total: 24 shares
       *
       * participant1 pays 100 and consumes 116.67 (16/24 * 175) → should give 16.67
       * participant2 pays 50 and consumes 21.88 (3/24 * 175) → should receive 28.13
       * participant3 pays 25 and consumes 14.58 (2/24 * 175) → should receive 10.42
       * participant4 pays 0 and consumes 21.88 (3/24 * 175) → should give 21.88
       */
      const participants = {
        participant1: createParticipant({
          _id: "participant1",
          share: { adults: 2, children: 0 },
          participantShare: {
            type: "custom",
            shares: [
              {
                label: "Share 1",
                multiplier: { adults: 2, children: 0 }, // x4
                period: {
                  start: new Date("2025-01-01"), // x4
                  end: new Date("2025-01-02"),
                  arrival: "AM",
                  departure: "PM",
                },
              },
            ],
          },
        }),
        participant2: createParticipant({
          _id: "participant2",
          share: { adults: 0, children: 1 },
          participantShare: {
            type: "custom",
            shares: [
              {
                label: "Share 1",
                multiplier: { adults: 1, children: 0 }, // x2
                period: {
                  start: new Date("2025-01-01"), // x2
                  end: new Date("2025-01-01"),
                  arrival: "PM",
                  departure: "PM",
                },
              },
              {
                label: "Share 2",
                multiplier: { adults: 0, children: 1 }, // x1
                period: {
                  start: new Date("2025-01-02"), // x1
                  end: new Date("2025-01-02"),
                  arrival: "AM",
                  departure: "AM",
                },
              },
            ],
          },
        }),
        participant3: createParticipant({
          _id: "participant3",
          share: { adults: 1, children: 0 },
          participantShare: {
            type: "custom",
            shares: [
              {
                label: "Share 1",
                multiplier: { adults: 0, children: 1 }, // x1
                period: {
                  start: new Date("2025-01-01"), // x2
                  end: new Date("2025-01-01"),
                  arrival: "AM",
                  departure: "PM",
                },
              },
            ],
          },
        }),
        participant4: createParticipant({
          _id: "participant4",
          share: { adults: 1, children: 1 },
          participantShare: {
            type: "custom",
            shares: [
              {
                label: "Share 1",
                multiplier: { adults: 0, children: 1 }, // x1
                period: {
                  start: new Date("2025-01-01"), // x1
                  end: new Date("2025-01-01"),
                  arrival: "PM",
                  departure: "PM",
                },
              },
              {
                label: "Share 2",
                multiplier: { adults: 1, children: 0 }, // x2
                period: {
                  start: new Date("2025-01-01"), // x2
                  end: new Date("2025-01-01"),
                  arrival: "AM",
                  departure: "PM",
                },
              },
            ],
          },
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "participant1",
          amount: "100",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "participant2",
          amount: "50",
          share: { type: "default" },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "participant3",
          amount: "25",
          share: { type: "default" },
        }),
      };

      const event = createEvent({
        participants,
        expenses: {
          expense1: expenses.expense1,
          expense2: expenses.expense2,
          expense3: expenses.expense3,
        },
        period: {
          start: new Date("2025-01-01"),
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      const distribution = getEventDistribution({
        event,
      });

      expect(distribution).toStrictEqual(
        Either.right({
          participant1: [
            {
              type: "give",
              amount: 769,
              participant: "participant2",
            },
          ],
          participant2: [
            {
              type: "receive",
              amount: 2212,
              participant: "participant4",
            },
            {
              type: "receive",
              amount: 769,
              participant: "participant1",
            },
          ],
          participant3: [
            {
              type: "receive",
              amount: 1154,
              participant: "participant4",
            },
          ],
          participant4: [
            {
              type: "give",
              amount: 1154,
              participant: "participant3",
            },
            {
              type: "give",
              amount: 2212,
              participant: "participant2",
            },
          ],
        })
      );
    });
  });
});
