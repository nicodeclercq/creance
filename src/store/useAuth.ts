import { useContext, useSyncExternalStore } from "react";

import { StoreContext } from "./StoreProvider";
import {
  getDefaultAuthManager,
  type AuthManager,
} from "./adapters/AuthManager";

export function useAuth(authManager: AuthManager = getDefaultAuthManager()) {
  const storeContext = useContext(StoreContext);

  if (storeContext === null) {
    throw new Error("useAuth must be used within a StoreProvider");
  }

  const state = useSyncExternalStore(
    (callback) => {
      const subscription = authManager.stateSubject.subscribe(() => callback());
      return () => subscription.unsubscribe();
    },
    () => authManager.getState(),
  );

  return {
    login: storeContext.login,
    signup: storeContext.signup,
    logout: storeContext.logout,
    state,
  };
}
