import {
  get,
  getAll,
  add,
  remove,
  update,
  of,
} from "./../services/ExpenseService";

export const useExpenseState = (id: string) => {
  return {
    get: get(id),
    getAll: getAll(id),
    add: add(id),
    remove: remove(id),
    update: update(id),
    of,
  };
};
