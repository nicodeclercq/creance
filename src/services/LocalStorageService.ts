import { Observable } from "rxjs";
import { State, isState, defaultState } from "./../models/State";

const KEY = "state";

export const saveState = ({ state }: { state: State }) => {
  try {
    Promise.resolve(localStorage.setItem(KEY, JSON.stringify(state)));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getState = () =>
  Promise.resolve(localStorage.getItem(KEY))
    .then((state) => JSON.parse(state ?? ""))
    .then((s) => (isState(s) ? s : defaultState));

export const connect = (state: Observable<State>) => {
  const subcription = state.subscribe({
    next: (state) => {
      saveState({ state });
    },
  });

  return () => subcription.unsubscribe();
};
