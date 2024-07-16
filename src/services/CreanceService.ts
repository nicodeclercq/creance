import * as Either from "fp-ts/Either";
import { isBefore } from "../utils/date";
import { Registered } from "../models/Registerable";
import { InitializationSteps } from "../models/State";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { register } from "../models/Registerable";
import { Creance } from "../models/State";
import { Expense } from "../models/Expense";
import * as Registerable from "../models/Registerable";
import { Store } from "./StoreService";
import * as SupabaseService from "./SupabaseService";

export const of = (creance: {
  id?: string;
  name: string;
  categories: Registered<Category>[];
  expenses: Registered<Expense>[];
  users: Registered<User>[];
  initialization: InitializationSteps;
}): Registerable.Registerable<Creance> => Registerable.of(creance);

export const add = (creance: Registerable.Unregistered<Creance>) => {
  const createdCreance = register(creance);
  const newState = {
    ...Store.value,
    creances: [...Store.value.creances, createdCreance],
  };

  SupabaseService.createCreance(createdCreance).then((creances) => {
    /*
      Store.next({
        ...Store.value,
        creances,
      });
      */
  });

  Store.next(newState);
};

export const update = (creance: Registerable.Registered<Creance>) => {
  const newState = {
    ...Store.value,
    creances: Store.value.creances.map((c) =>
      Registerable.equals(c, creance) ? creance : c
    ),
  };

  SupabaseService.updateCreance(creance);

  Store.next(newState);
};

export const remove = (id: string) => {
  const newState = {
    ...Store.value,
    creances: Store.value.creances.filter((creance) => creance.id !== id),
  };

  SupabaseService.deleteCreance(id);

  Store.next(newState);
};

export const get = (id: string) =>
  Either.fromNullable(`Unknown créance id ${id}`)(
    Store.value.creances.find((creance) => creance.id === id)
  );

export const getAll = () => Store.value.creances;

export const isLocked = (creance: Registered<Creance>) => {
  if (!creance.endDate) {
    return false;
  }
  const date =
    typeof creance.endDate === "string"
      ? new Date(creance.endDate)
      : creance.endDate;

  return isBefore(new Date())(date);
};
