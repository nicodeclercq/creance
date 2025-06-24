import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { User } from "../models/User";

const withoutKey = <K extends keyof T, T extends Record<string, any>>(
  obj: T,
  key: K
): Omit<T, K> => {
  const { [key]: _, ...rest } = obj;
  return rest;
};

export function toExportedData({
  event,
  deposits,
  expenses,
  users,
}: {
  event: Event;
  deposits: Record<string, Deposit>;
  expenses: Record<string, Expense>;
  users: Record<string, User>;
}) {
  return {
    ...withoutKey(event, "updatedAt"),
    participants: event.participants.map((userId) =>
      withoutKey(users[userId], "updatedAt")
    ),
    expenses: event.expenses.map((expenseId) => ({
      ...expenses[expenseId],
      lender: expenses[expenseId].lender,
    })),
    deposits: event.deposits.map((depositId) =>
      withoutKey(deposits[depositId], "updatedAt")
    ),
  };
}

function removeSpecialChars(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}

export function exportData(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${removeSpecialChars(name)}-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
