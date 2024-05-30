import { UID } from "./../@types/uid.d";
import { register } from "../models/Registerable";
import { fromNullable } from "fp-ts/es6/Either";
import * as Record from "fp-ts/Record";

import { Creance } from "../models/State";
import { Expense } from "../models/Expense";
import * as Registerable from "../models/Registerable";
import { calculateExpression } from "../utils/number";

export const of = (expense: {
  id?: string;
  amount: string;
  description: string;
  category: UID;
  from: UID;
  distribution: { [key: string]: string };
}): Registerable.Registered<Expense> =>
  Registerable.of({
    ...expense,
    amount: calculateExpression(expense.amount),
    distribution: Record.map(parseFloat)(expense.distribution),
    date: new Date(),
  });

export const add =
  (state: Registerable.Registered<Creance>) =>
  (expense: Registerable.Unregistered<Expense>): Creance => ({
    ...state,
    expenses: [...state.expenses, register(expense)],
  });

export const update =
  (state: Registerable.Registered<Creance>) =>
  (expense: Registerable.Registered<Expense>): Creance => ({
    ...state,
    expenses: state.expenses.map((exp) =>
      Registerable.equals(exp, expense) ? expense : exp
    ),
  });

export const remove =
  (state: Registerable.Registered<Creance>) =>
  (id: string): Creance => {
    const result = {
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== id),
    };
    return result;
  };

export const get = (state: Registerable.Registered<Creance>) => (id: string) =>
  fromNullable(`Unknown expense id ${id}`)(
    state.expenses.find((expense) => expense.id === id)
  );
export const getAll = (state: Registerable.Registered<Creance>) => () =>
  state.expenses;
