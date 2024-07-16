import {
  get,
  getAll,
  add,
  update,
  remove,
  of,
  isEmpty,
  count,
} from "./../services/UserService";

export const useUserState = (id: string) => ({
  isEmpty: isEmpty(id),
  get: get(id),
  getAll: getAll(id),
  add: add(id),
  update: update(id),
  remove: remove(id),
  of,
  count: count(id),
});
