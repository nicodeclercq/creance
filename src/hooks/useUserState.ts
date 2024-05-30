import { get, getAll, add, update, remove, of, isEmpty } from './../services/UserService';
import { useCreanceState } from './useCreanceState';

export const useUserState = (id?: string) => {
  const { state, setState } = useCreanceState(id);

  return {
    isEmpty: isEmpty(state),
    get: get(state),
    getAll: getAll(state),
    add: setState(add),
    update: setState(update),
    remove: setState(remove),
    of,
    count: getAll(state).length,
  }
}