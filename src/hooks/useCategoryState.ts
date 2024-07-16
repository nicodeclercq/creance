import {
  get,
  getAll,
  add,
  remove,
  update,
  of,
  isEmpty,
  count,
} from "./../services/CategoryService";

export const useCategoryState = (id: string) => ({
  isEmpty: isEmpty(id),
  get: get(id),
  getAll: getAll(id),
  add: add(id),
  remove: remove(id),
  update: update(id),
  of,
  count: count(id),
});
