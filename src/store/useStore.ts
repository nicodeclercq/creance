import { useContext, useSyncExternalStore } from "react";

import type { State } from "./state";
import { StoreContext } from "./StoreProvider";
import type { StoreState } from "./StoreProvider";

export const useStoreSelector = <T>(
  select: (state: StoreState<State>) => T,
): T => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("useStore must be used within a Provider");
  }

  return useSyncExternalStore(
    (callback) => {
      const subscription = context.stateSubject.subscribe(callback);
      return () => subscription.unsubscribe();
    },
    () => select(context.stateSubject.getValue()),
  );
};

export const useStore = (): StoreState<State> =>
  useStoreSelector((state) => state);
