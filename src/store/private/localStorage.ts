import type { FirstStoreAdapter } from "../StoreManager";
import type { State } from "../state";
import { StoreManager } from "../StoreManager";
import { validateOrDefaultsToState } from "../state";

function getStateFromLocalStorage(): Promise<State> {
  return Promise.resolve(localStorage.getItem("state"))
    .then((jsonData) => (jsonData ? JSON.parse(jsonData) : undefined))
    .then(validateOrDefaultsToState);
}

function setStateInLocalStorage(state: State) {
  localStorage.setItem("state", JSON.stringify(state));
}

export const LocalStorageAdapter: FirstStoreAdapter<State> = {
  initializer: getStateFromLocalStorage,
  onStateChange: (state) => {
    if (StoreManager.hasData(state)) {
      setStateInLocalStorage(state.data);
    }
  },
};
