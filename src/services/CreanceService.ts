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

  SupabaseService.createCreance(createdCreance);
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

const mergeLists = <A extends { id: string }>(
  aa: A[],
  bb: A[],
  mergeObjects: (a: A, b: A) => A
) => {
  const aNotInB = aa.filter(
    (category) => !bb.find((c) => c.id === category.id)
  );

  const addedToA: A[] = [];
  const addedToB: A[] = aNotInB;
  const updated: A[] = [];
  const result = [
    ...aNotInB,
    ...bb.map((b) => {
      const a = aa.find((a) => a.id === b.id);
      if (a != null) {
        if (JSON.stringify(a) !== JSON.stringify(b)) {
          // Exists in a and b, but different
          const merge = mergeObjects(a, b);
          updated.push(merge);
          return merge;
        } else {
          return a;
        }
      } else {
        // Doesn't exist in a
        addedToA.push(b);
        return b;
      }
    }),
  ];

  return {
    result,
    addedToA,
    addedToB,
    updated,
  } as const;
};

const mergeCreances = (
  base: Registerable.Registered<Creance>,
  override: Registerable.Registered<Creance>
) => ({
  ...override,
  categories: mergeLists(base.categories, override.categories, (_a, b) => b)
    .result,
  expenses: mergeLists(base.expenses, override.expenses, (_a, b) => b).result,
  users: mergeLists(base.users, override.users, (_a, b) => b).result,
});

export const mergeCreanceLists = ({
  local,
  remote,
}: {
  local: Registerable.Registered<Creance>[];
  remote: Registerable.Registered<Creance>[];
}) => {
  const mergeResult = mergeLists(local, remote, mergeCreances);
  const result = {
    merge: mergeResult.result,
    addedToLocal: mergeResult.addedToA,
    addedToRemote: mergeResult.addedToB,
    updated: mergeResult.updated,
  };

  console.log("merge result", result);

  result.updated.forEach((creance) => SupabaseService.updateCreance(creance));
  result.addedToRemote.forEach((creance) =>
    SupabaseService.createCreance(creance)
  );

  Store.next({
    ...Store.value,
    creances: result.merge,
  });
};
