import { get, getAll, add, remove, update, of } from './../services/ExpenseService';
import { useCreanceState } from './useCreanceState';

export const useExpenseState = (id?: string) => {
  const { state, setState } = useCreanceState(id);

  return {
    get: get(state),
    getAll: getAll(state),
    add: setState(add),
    remove: setState(remove),
    update: setState(update),
    of,
  }
}