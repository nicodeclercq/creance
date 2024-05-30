import { isBefore } from "../utils/date";
import { Registered } from "../models/Registerable";
import { InitializationSteps, State } from "../models/State";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { register } from "../models/Registerable";
import { fromNullable } from "fp-ts/es6/Either";

import { Creance } from "../models/State";
import { Expense } from "../models/Expense";
import * as Registerable from "../models/Registerable";

export const of = (creance: {
  id?: string;
  name: string;
  categories: Registered<Category>[];
  expenses: Registered<Expense>[];
  users: Registered<User>[];
  initialization: InitializationSteps;
}): Registerable.Registerable<Creance> => Registerable.of(creance);

export const add =
  (state: State) =>
  (creance: Registerable.Unregistered<Creance>): State => ({
    ...state,
    creances: [...state.creances, register(creance)],
  });

export const update =
  (state: State) =>
  (creance: Registerable.Registered<Creance>): State => ({
    ...state,
    creances: state.creances.map((c) =>
      Registerable.equals(c, creance) ? creance : c
    ),
  });

export const remove =
  (state: State) =>
  (id: string): State => {
    const result = {
      ...state,
      creances: state.creances.filter((creance) => creance.id !== id),
    };
    return result;
  };

export const get = (state: State) => (id: string) =>
  fromNullable(`Unknown créance id ${id}`)(
    state.creances.find((creance) => creance.id === id)
  );
export const getAll = (state: State) => () => state.creances;

export const isLocked = (state: Registered<Creance>) => {
  if (!state.endDate) {
    return false;
  }
  const date =
    typeof state.endDate === "string" ? new Date(state.endDate) : state.endDate;

  return isBefore(new Date())(date);
};
