import * as CreanceService from "../services/CreanceService";
import * as Either from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import * as Registerable from "../models/Registerable";

import { Creance } from "../models/State";
import { Expense } from "../models/Expense";
import { UID } from "./../@types/uid.d";
import { calculateExpression } from "../utils/number";
import { pipe } from "fp-ts/function";
import { register } from "../models/Registerable";

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
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (expense: Registerable.Unregistered<Expense>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        expenses: [...creance.expenses, register(expense)],
      })),
      Either.map(CreanceService.update)
    );

export const update =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (expense: Registerable.Registered<Expense>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        expenses: creance.expenses.map((exp) =>
          Registerable.equals(exp, expense) ? expense : exp
        ),
      })),
      Either.map(CreanceService.update)
    );

export const remove =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (id: string) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        expenses: creance.expenses.filter((expense) => expense.id !== id),
      })),
      Either.map(CreanceService.update)
    );

export const get =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (id?: string) =>
    pipe(
      getAll(creanceId)(),
      Either.map((expenses) => expenses.find((expense) => expense.id === id)),
      Either.chain(Either.fromNullable(`Unknown expense id ${id}`))
    );

export const getAll =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map((creance) =>
        creance.expenses.sort(
          (expenseA, expenseB) =>
            expenseB.date.getTime() - expenseA.date.getTime()
        )
      )
    );
