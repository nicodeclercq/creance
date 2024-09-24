import * as Either from "fp-ts/Either";

import {
  add,
  count,
  get,
  of,
  remove,
  update,
} from "./../services/CategoryService";

import { pipe } from "fp-ts/function";
import { useCreanceState } from "./useCreanceState";

export const useCategoryState = (id: string) => {
  const { currentCreance } = useCreanceState(id);

  return {
    categories: pipe(
      currentCreance?.categories,
      Either.fromNullable("Creance not found")
    ),
    isEmpty: pipe(
      currentCreance?.categories,
      Either.fromNullable("Creance not found"),
      Either.map((categories) => categories.length === 0)
    ),
    get: get(id),
    add: add(id),
    remove: remove(id),
    update: update(id),
    of,
    count: count(id),
  };
};
