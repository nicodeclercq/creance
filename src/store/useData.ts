import * as RX from "rxjs";

import type { Path, ValueFromPath } from "../utils/object";
import { getValueFromPath, setValueAtPath } from "../utils/object";
import { useContext, useEffect, useState } from "react";

import type { State } from "./state";
import { StoreContext } from "./StoreProvider";
import { StoreManager } from "./StoreManager";

export function useData<P extends Path<State>>(path: P) {
  const store = useContext(StoreContext);
  const value = store.getValue();

  const defaultState = StoreManager.hasData(value) ? value.data : undefined;

  if (defaultState === undefined) {
    throw new Error("No state found");
  }

  const [state, setState] = useState<ValueFromPath<P, State>>(
    getValueFromPath<P, State>(path)(defaultState)
  );

  useEffect(() => {
    const subscription = store
      .pipe(
        RX.filter(StoreManager.hasData),
        RX.map((value) => value.data),
        RX.map(getValueFromPath(path)),
        RX.distinctUntilChanged()
      )
      .subscribe({
        next: setState,
      });

    return () => subscription.unsubscribe();
  }, [store, path]);

  const change = (
    map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>
  ) => {
    const currentValue = store.getValue();

    if (StoreManager.hasData(currentValue)) {
      StoreManager.update({
        ...currentValue,
        data: setValueAtPath(path, map, currentValue.data),
      });
    }
  };

  return [state, change] as const;
}
