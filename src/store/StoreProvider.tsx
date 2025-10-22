import { InitializationTasks } from "./private/initializationTasks";
import { LocalStorageAdapter } from "./private/localStorage";
import type { ReactNode } from "react";
import { StoreManager } from "./StoreManager";
import { createContext } from "react";

StoreManager.launch({
  adapters: [LocalStorageAdapter, InitializationTasks],
});

export const StoreContext = createContext(StoreManager.$store);

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={StoreManager.$store}>
      {children}
    </StoreContext.Provider>
  );
}
