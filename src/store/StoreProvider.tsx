import type { ReactNode } from "react";
import { createContext } from "react";

import { LocalStorageAdapter } from "./private/localStorage";
import { StoreManager } from "./StoreManager";
StoreManager.launch({
  adapters: [LocalStorageAdapter],
});

export const StoreContext = createContext(StoreManager.$store);

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={StoreManager.$store}>
      {children}
    </StoreContext.Provider>
  );
}
