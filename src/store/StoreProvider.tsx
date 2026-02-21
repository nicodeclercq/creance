import { createContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import type { State } from "./state";
import { type StoreState } from "./createStore";
import type { BehaviorSubject } from "rxjs";
import { store } from "./store";
import type { Credentials } from "./adapters/AuthManager";

export type { StoreState } from "./createStore";

const isLoading = <T extends unknown>(
  state: StoreState<T>,
): state is { status: "loading" } => state.status === "loading";

type StoreContextValue<T> = {
  login: (credentials?: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  stateSubject: BehaviorSubject<StoreState<State>>;
  updateState: (update: T | ((current: T) => T)) => void;
};
export const StoreContext = createContext<StoreContextValue<State> | null>(
  null,
);

export function StoreProvider({
  children,
  loadingRenderer: LoadingRenderer,
}: {
  children: ReactNode;
  loadingRenderer: () => ReactNode;
}) {
  const [storeState, setStoreState] = useState<StoreState<State>>(
    store.getState(),
  );

  useEffect(() => store.subscribe(setStoreState), []);

  const contextValue: StoreContextValue<State> = {
    login: store.login,
    logout: store.logout,
    signup: store.signup,
    stateSubject: store.stateSubject,
    updateState: store.updateState,
  };

  return isLoading(storeState) ? (
    <LoadingRenderer />
  ) : (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
