import { CacheStorageAdapter } from "./private/cacheStorage";
import { InitializationTasks } from "./private/initializationTasks";
// import { LocalStorageAdapter } from "./private/localStorage";
import type { ReactNode } from "react";
import { StoreManager, type Store } from "./StoreManager";
import { createContext, useEffect, useState } from "react";
import type { State } from "./state";

StoreManager.launch({
  adapters: [/*LocalStorageAdapter,*/ CacheStorageAdapter, InitializationTasks],
});

export const StoreContext = createContext(StoreManager.$store);

export function StoreProvider({
  children,
  loadingRenderer: LoadingRenderer,
}: {
  children: ReactNode;
  loadingRenderer: () => ReactNode;
}) {
  const [storeState, setStoreState] = useState<Store<State>>(
    StoreManager.$store.getValue()
  );

  useEffect(() => {
    const subscription = StoreManager.$store.subscribe(setStoreState);
    return () => subscription.unsubscribe();
  }, []);

  if (StoreManager.isLoading(storeState)) {
    return <LoadingRenderer />;
  }

  return (
    <StoreContext.Provider value={StoreManager.$store}>
      {children}
    </StoreContext.Provider>
  );
}
