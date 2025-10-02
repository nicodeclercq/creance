import * as RX from "rxjs";

import { Store, StoreManager } from "./StoreManager";
import { useContext, useEffect, useState } from "react";

import { Logger } from "../service/Logger";
import { State } from "./state";
import { StoreContext } from "./StoreProvider";

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
