import * as Either from "fp-ts/Either";

import { fromState, toState } from "../../adapters/json";

import { DEFAULT_STATE } from "../state";
import type { FirstStoreAdapter } from "../StoreManager";
import { Logger } from "../../service/Logger";
import type { State } from "../state";
import { StoreManager } from "../StoreManager";
import { pipe } from "fp-ts/function";

function getStateFromLocalStorage(): Either.Either<Error, State> {
  return pipe(
    localStorage.getItem("state"),
    Either.fromNullable(new Error("No state in localStorage")),
    Either.chain((state) => {
      try {
        return Either.right(JSON.parse(state));
      } catch (error) {
        return Either.left(error as Error);
      }
    }),
    Either.chainW(toState)
  );
}

function setStateInLocalStorage(state: State) {
  localStorage.setItem("state", fromState(state));
}

export const LocalStorageAdapter: FirstStoreAdapter<State> = {
  initializer: () =>
    pipe(
      getStateFromLocalStorage(),
      Either.getOrElseW((error) => {
        Logger.error("Unable to get state from localStorage")(error);
        Logger.info("Using default state")();
        return DEFAULT_STATE;
      })
    ),
  onStateChange: (state) => {
    if (StoreManager.hasData(state)) {
      setStateInLocalStorage(state.data);
    }
  },
};
