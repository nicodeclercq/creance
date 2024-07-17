import { Observable } from "rxjs";
import { State, isState, defaultState } from "./../models/State";

const KEY = "state";

export const saveState = ({ state }: { state: State }) => {
  try {
    Promise.resolve(state)
      .then(({ _tag, creances, settings }) =>
        JSON.stringify({ _tag, creances, settings })
      )
      .then((state) => localStorage.setItem(KEY, state));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getState = () =>
  Promise.resolve()
    .then(() => localStorage.getItem(KEY))
    .then((state) => JSON.parse(state ?? "{}"))
    .then((s) => (isState(s) ? s : defaultState));

export const connect = (state: Observable<State>) => {
  const subscription = state.subscribe({
    next: (state) => {
      saveState({ state });
    },
  });

  return () => subscription.unsubscribe();
};
