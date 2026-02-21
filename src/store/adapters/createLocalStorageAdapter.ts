import type { Adapter } from "../createStore";
import type { State } from "../state";
import { createLocalAdapter } from "./createLocalAdapter";

export type LocalStorageAdapterConfig = {
  key: string;
  storage?: Storage;
};

export const createLocalStorageAdapter = (
  config: LocalStorageAdapterConfig
): Adapter<State> => {
  const { key, storage = localStorage } = config;

  return createLocalAdapter({
    name: "LocalStorageAdapter",

    read: () => storage.getItem(key) ?? undefined,

    write: (data) => storage.setItem(key, data),

    clear: () => storage.removeItem(key),

    subscribe: (callback) => {
      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key !== key || event.newValue === null) return;
        callback(event.newValue);
      };

      window.addEventListener("storage", handleStorageEvent);
      return () => window.removeEventListener("storage", handleStorageEvent);
    },
  });
};
