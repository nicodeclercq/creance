import type { Path, ValueFromPath } from "../utils/object";
import { StoreContext } from "./StoreProvider";
import { getValueFromPath, setValueAtPath } from "../utils/object";
import { useContext } from "react";

import { type State, DEFAULT_STATE } from "./state";
import { useStoreSelector } from "./useStore";

export function useData<P extends Path<State>>(path: P) {
  const value = useStoreSelector((state) =>
    state.status === "ready"
      ? getValueFromPath<P, State>(path)(state.data)
      : getValueFromPath<P, State>(path)(DEFAULT_STATE),
  );

  const context = useContext(StoreContext)!;

  const change = (
    map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>,
  ) => {
    const currentState = context.stateSubject.getValue();
    if (currentState.status === "ready") {
      context.updateState(setValueAtPath(path, map, currentState.data));
    }
  };

  return [value, change] as const;
}
