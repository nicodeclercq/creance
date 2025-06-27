import * as Either from "fp-ts/Either";

import { CustomUserShare, Event } from "../models/Event";
import { describe, expect, it } from "vitest";
import {
  getCustomUserShareCount,
  getDefaultUserShareCount,
  getDepositShares,
  getEventDistribution,
  getEventSharesByUser,
  getExpenseAmountByCategory,
  getExpenseShares,
  getHalfDaysCount,
  getTotalExpenseAmount,
} from "./calculation";

import { Deposit } from "../models/Deposit";
import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { pipe } from "fp-ts/function";
import { uid } from "./crypto";

const createEvent = (defaultValues: Partial<Event> = {}): Event => ({
  _id: uid(),
  name: "Event Name",
  description: "",
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
  deposits: [],
  expenses: [],
  participants: [],
  isClosed: false,
  period: {
    start: new Date("2025-01-01"), // x1
    arrival: "PM",
    end: new Date("2025-01-01"),
    departure: "PM",
  },
  shares: {},
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
const createUser = (defaultValues: Partial<User> = {}): User => ({
  _id: uid(),
  name: "User Name",
  share: {
    adults: 1,
    children: 0,
  },
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

  describe("getDefaultUserShareCount", () => {
    it("should return the default share count for a child (*1)", () => {
      const share = getDefaultUserShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createUser({
          share: { adults: 0, children: 1 },
        })
      );

      expect(share).toBe(8 * 1);
    });
    it("should return the default share count for an adult (*2)", () => {
      const share = getDefaultUserShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createUser({
          share: { adults: 1, children: 0 },
        })
      );

      expect(share).toBe(8 * 2);
    });
    it("should return the default share count for a group of users", () => {
      const share = getDefaultUserShareCount(
        {
          start: new Date("2025-01-01"),
          arrival: "PM",
          end: new Date("2025-01-05"),
          departure: "AM",
        },
        createUser({
          share: { adults: 2, children: 1 },
        })
      );

      expect(share).toBe(8 * (4 + 1));
    });
  });

  describe("getCustomUserShareCount", () => {
    it("should return the custom share count for a user", () => {
      const customShares: CustomUserShare = {
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

      const share = getCustomUserShareCount(customShares);

      expect(share).toBe(36);
    });
  });

  describe("getExpenseShares", () => {
    it("should return the default shares by user", () => {
      const users = {
        user1: createUser({
          _id: "user1",
          share: { adults: 2, children: 4 }, // x8
        }),
        user2: createUser({
          _id: "user2",
          share: { adults: 1, children: 2 }, // x4
        }),
      };
      const expense = createExpense({
        amount: "300",
        lender: "user1",
      });
      const event = createEvent({
        expenses: [expense._id],
        participants: ["user1", "user2"],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
        },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, users, event })).toStrictEqual(
        Either.right({
          user1: 20000,
          user2: 10000,
        })
      );
    });

    it("should return the proportianal shares by user", () => {
      const users = {
        user1: createUser({
          _id: "user1",
        }),
        user2: createUser({
          _id: "user2",
        }),
      };
      const expense = createExpense({
        amount: "80",
        lender: "user1",
        share: {
          type: "percentage",
          distribution: {
            user1: "25",
            user2: "75",
          },
        },
      });
      const event = createEvent({
        expenses: [expense._id],
        participants: ["user1", "user2"],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
        },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, users, event })).toStrictEqual(
        Either.right({
          user1: 2000,
          user2: 6000,
        })
      );
    });

    it("should return the fixed shares by user", () => {
      const users = {
        user1: createUser({
          _id: "user1",
        }),
        user2: createUser({
          _id: "user2",
        }),
      };
      const expense = createExpense({
        amount: "100",
        lender: "user1",
        share: {
          type: "fixed",
          distribution: {
            user1: "25",
            user2: "75",
          },
        },
      });
      const event = createEvent({
        expenses: [expense._id],
        participants: ["user1", "user2"],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
        },
        period: {
          start: new Date("2025-01-01"), // x2
          arrival: "AM",
          end: new Date("2025-01-01"),
          departure: "PM",
        },
      });

      expect(getExpenseShares({ expense, users, event })).toStrictEqual(
        Either.right({
          user1: 2500,
          user2: 7500,
        })
      );
    });
  });

  describe("getEventSharesByUser", () => {
    it("should add the deposit as an expense for the donator and as a negative expense for the reciever", () => {
      const users = {
        user1: createUser({
          _id: "user1",
        }),
        user2: createUser({
          _id: "user2",
        }),
        user3: createUser({
          _id: "user3",
        }),
      };
      const deposits = {
        deposit1: createDeposit({
          _id: "deposit1",
          from: "user1",
          to: "user2",
          amount: "100",
        }),
        deposit2: createDeposit({
          _id: "deposit2",
          from: "user2",
          to: "user3",
          amount: "50",
        }),
        deposit3: createDeposit({
          _id: "deposit3",
          from: "user3",
          to: "user1",
          amount: "25",
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Transport",
          lender: "user1",
          amount: "100",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Food",
          lender: "user2",
          amount: "50",
          share: { type: "default" },
        }),
        expense3: createExpense({
          _id: "expense3",
          category: "Food",
          lender: "user3",
          amount: "25",
          share: { type: "default" },
        }),
      };

      const event = createEvent({
        deposits: [
          deposits.deposit1._id,
          deposits.deposit2._id,
          deposits.deposit3._id,
        ],
        expenses: [
          expenses.expense1._id,
          expenses.expense2._id,
          expenses.expense3._id,
        ],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
          user3: { type: "default" },
        },
        participants: ["user1", "user2", "user3"],
      });

      const user1Shares = getEventSharesByUser({
        event,
        expenses,
        users,
        userId: "user1",
      });

      expect(
        pipe(
          user1Shares,
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
          { type: "expense", amount: "100", category: "Transport" }, // expense1
          { type: "expense", amount: "50", category: "Food" }, // expense2
          { type: "expense", amount: "25", category: "Food" }, // expense2
        ])
      );
    });
  });

  describe("getDepositSharesByUsers", () => {
    it("shoult give negative share for receiver", () => {
      const deposits = {
        deposit1: createDeposit({
          _id: "deposit1",
          from: "user1",
          to: "user2",
          amount: "100",
        }),
        deposit2: createDeposit({
          _id: "deposit2",
          from: "user2",
          to: "user1",
          amount: "200",
        }),
      };

      const event = createEvent({
        deposits: [deposits.deposit1._id, deposits.deposit2._id],
      });

      const users = {
        user1: createUser({ _id: "user1" }),
        user2: createUser({ _id: "user2" }),
      };

      const shares = getDepositShares({
        event,
        deposits,
        users,
      });

      expect(shares).toStrictEqual(
        Either.right({
          user1: [
            {
              _id: "deposit1",
              date: new Date("2025-01-01"),
              userId: "user2",
              share: 10000,
            },
            {
              _id: "deposit2",
              date: new Date("2025-01-01"),
              userId: "user2",
              share: -20000,
            },
          ],
          user2: [
            {
              _id: "deposit1",
              date: new Date("2025-01-01"),
              userId: "user1",
              share: -10000,
            },
            {
              _id: "deposit2",
              date: new Date("2025-01-01"),
              userId: "user1",
              share: 20000,
            },
          ],
        })
      );
    });
  });

  describe("getEventDistribution", () => {
    it("should distribute the expenses and deposits to users, case 1", () => {
      const users = {
        user1: createUser({ _id: "user1", share: { adults: 4, children: 0 } }),
        user2: createUser({ _id: "user2", share: { adults: 1, children: 0 } }),
        user3: createUser({ _id: "user3", share: { adults: 2, children: 0 } }),
        user4: createUser({ _id: "user4", share: { adults: 1, children: 0 } }),
      };
      const deposits = {
        deposit1: createDeposit({
          _id: "deposit1",
          from: "user1",
          to: "user2",
          amount: "100",
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Food",
          lender: "user2",
          amount: "300",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Transport",
          lender: "user1",
          amount: "100",
          share: { type: "default" },
        }),
      };
      const event = createEvent({
        deposits: [deposits.deposit1._id],
        expenses: [expenses.expense1._id, expenses.expense2._id],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
          user3: { type: "default" },
          user4: { type: "default" },
        },
        participants: ["user1", "user2", "user3", "user4"],
      });

      /*
      Total Expenses: 400
      Shares: 8 (4+1+2+1)
      Total Payed:
      - user1 100 expense + 100 deposit = 200
      - user2 300 expense - 100 deposit = 200
      - user3 0 expense + 0 deposit = 0
      - user4 0 expense + 0 deposit = 0
      Total Due:
      - user1 400 / 8 * 4 = 200
      - user2 400 / 8 * 1 = 50
      - user3 400 / 8 * 2 = 100
      - user4 400 / 8 * 1 = 50
      Distribution:
      - user1: receive 0, pay 0
      - user2: receive 150 from user3 and user4
      - user3: pay 100 to user2
      - user4: pay 50 to user2
      */

      const distribution = getEventDistribution({
        event,
        deposits,
        expenses,
        users,
      });

      expect(distribution).toStrictEqual(
        Either.right({
          user2: [
            {
              type: "receive",
              amount: 10000,
              user: "user3",
            },
            {
              type: "receive",
              amount: 5000,
              user: "user4",
            },
          ],
          user3: [
            {
              type: "give",
              amount: 10000,
              user: "user2",
            },
          ],
          user4: [
            {
              type: "give",
              amount: 5000,
              user: "user2",
            },
          ],
        })
      );
    });

    it("should distribute the expenses and deposits to users, case 2", () => {
      const users = {
        user1: createUser({ _id: "user1", share: { adults: 4, children: 0 } }), // 8
        user2: createUser({ _id: "user2", share: { adults: 1, children: 1 } }), // 3
        user3: createUser({ _id: "user3", share: { adults: 1, children: 0 } }), // 2
        user4: createUser({ _id: "user4", share: { adults: 1, children: 1 } }), // 3
      };
      const deposits = {
        deposit1: createDeposit({
          _id: "deposit1",
          from: "user1",
          to: "user2",
          amount: "100",
        }),
      };
      const expenses = {
        expense1: createExpense({
          _id: "expense1",
          category: "Food",
          lender: "user2",
          amount: "300",
          share: { type: "default" },
        }),
        expense2: createExpense({
          _id: "expense2",
          category: "Transport",
          lender: "user1",
          amount: "150",
          share: { type: "default" },
        }),
      };
      const event = createEvent({
        deposits: [deposits.deposit1._id],
        expenses: [expenses.expense1._id, expenses.expense2._id],
        shares: {
          user1: { type: "default" },
          user2: { type: "default" },
          user3: { type: "default" },
          user4: { type: "default" },
        },
        participants: ["user1", "user2", "user3", "user4"],
      });

      /*
      Total Expenses: 450 (300+150)
      Shares: 16 (8+3+2+3)
      Total Payed:
      - user1 150 expense + 100 deposit = 250
      - user2 300 expense - 100 deposit = 200
      - user3 0 expense + 0 deposit = 0
      - user4 0 expense + 0 deposit = 0
      Total Due:
      - user1 450 / 16 * 8 = 225
      - user2 450 / 16 * 3 = 84.375
      - user3 450 / 16 * 2 = 56.25
      - user4 450 / 16 * 3 = 84.375
      Distribution:
      - user1: receive 25
      - user2: receive 115.625
      - user3: pay 56.25 to user2
      - user4: pay 25 to user1, 59.375 to user2 (total 84.375)
      */

      const distribution = getEventDistribution({
        event,
        deposits,
        expenses,
        users,
      });

      expect(distribution).toStrictEqual(
        Either.right({
          user1: [
            {
              type: "receive",
              amount: 2500,
              user: "user4",
            },
          ],
          user2: [
            {
              type: "receive",
              amount: 5938,
              user: "user4",
            },
            {
              type: "receive",
              amount: 5624,
              user: "user3",
            },
          ],
          user3: [
            {
              type: "give",
              amount: 5624,
              user: "user2",
            },
          ],
          user4: [
            {
              type: "give",
              amount: 2500,
              user: "user1",
            },
            {
              type: "give",
              amount: 5938,
              user: "user2",
            },
          ],
        })
      );
    });
  });
});
