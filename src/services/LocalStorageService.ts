import { Observable } from "rxjs";
import { State, isState, defaultState } from "./../models/State";

const KEY = "state";

export const saveState = ({ state }: { state: State }) => {
  try {
    Promise.resolve(state)
      .then(JSON.stringify)
      .then((state) => localStorage.setItem(KEY, state));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getState = () =>
  Promise.resolve(KEY)
    .then(localStorage.getItem)
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
