import { get, getAll, add, remove, update, of, isEmpty } from './../services/CategoryService';
import { useCreanceState } from './useCreanceState';

export const useCategoryState = (id?: string) => {
  const {state, setState } = useCreanceState(id);

  return {
    isEmpty: isEmpty(state),
    get: get(state),
    getAll: getAll(state),
    add: setState(add),
    remove: setState(remove),
    update: setState(update),
    of,
    count: () => getAll(state).length,
  }
}