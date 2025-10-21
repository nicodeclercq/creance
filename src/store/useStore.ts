import * as RX from "rxjs";

import { useContext, useEffect, useState } from "react";

import { Logger } from "../service/Logger";
import type { State } from "./state";
import type { Store } from "./StoreManager";
import { StoreContext } from "./StoreProvider";
import { StoreManager } from "./StoreManager";

export function useStore() {
  const store = useContext(StoreContext);
  const [state, setState] = useState<Store<State>>(store.getValue());

  useEffect(() => {
    const subscription = store
      .pipe(RX.distinctUntilChanged(), RX.map(Logger.log("state")))
      .subscribe({
        next: setState,
      });

    return () => subscription.unsubscribe();
  }, [store]);

  const change = (map: (oldValue: Store<State>) => Store<State>) => {
    const currentValue = store.getValue();

    if (StoreManager.hasData(currentValue)) {
      StoreManager.update(map(currentValue));
    }
  };

  return [state, change] as const;
}
