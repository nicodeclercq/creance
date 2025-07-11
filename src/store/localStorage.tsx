import * as Either from "fp-ts/Either";

import { DEFAULT_STATE, State } from "./state";
import { fromState, toState } from "../adapters/json";

import { pipe } from "fp-ts/function";

export function synchronizeLocalStorage({
  load,
  onChange,
}: {
  load: (state: State) => void;
  onChange: (callback: (state: State) => void) => void;
}) {
  pipe(
    localStorage.getItem("state"),
    Either.fromNullable(new Error("No state in localStorage")),
    Either.chain((state) => {
      try {
        return Either.right(JSON.parse(state));
      } catch (error) {
        return Either.left(error as Error);
      }
    }),
    Either.chainW(toState),
    Either.getOrElse((error) => {
      console.error(
        "Failed to load state from localStorage:",
        error,
        localStorage.getItem("state")
      );
      return DEFAULT_STATE;
    }),
    load
  );

  onChange((state) => {
    localStorage.setItem("state", fromState(state));
  });
}
