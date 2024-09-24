import * as Either from "fp-ts/Either";

import { add, of, remove, update } from "./../services/ExpenseService";

import { pipe } from "fp-ts/function";
import { useCreanceState } from "./useCreanceState";

export const useExpenseState = (id: string) => {
  const { currentCreance } = useCreanceState(id);

  return {
    expenses: pipe(
      currentCreance?.expenses,
      Either.fromNullable("Creance not found")
    ),
    add: add(id),
    remove: remove(id),
    update: update(id),
    of,
  };
};
