import { useEffect, useState } from "react";
import { pipe, flow } from "fp-ts/function";
import { BehaviorSubject, distinctUntilChanged } from "rxjs";
import {
  type State,
  type Path,
  type ValueAt,
  update,
  read,
  INITIAL_STATE,
} from "../domain/state";
import { Fn } from "../../@types/function";

/**
 * Shared state object
 */
export const state = new BehaviorSubject<State>(INITIAL_STATE);

export function useSyncStateByLens<P>(
  getter: Fn<[State], P>,
  setter: (newValue: P) => (currenctState: State) => State
) {
  const [currentValue, setCurrentValue] = useState<P>(getter(state.value));

  useEffect(function updateOnChange() {
    const subscription = state
      .asObservable()
      .pipe(distinctUntilChanged())
      .subscribe({
        next: flow(getter, setCurrentValue),
      });

    return () => subscription.unsubscribe();
  }, []);

  const updateValue = (v: P) => pipe(state.value, setter(v), state.next);

  return [currentValue, updateValue] as const;
}

/**
 * Main entry point to the state from a React perspective
 */
export function useSyncState<P extends Path<State>>(path: P) {
  return useSyncStateByLens<ValueAt<P, State>>(
    read(path),
    (newValue: ValueAt<P, State>) => update(path, newValue)
  );
}
