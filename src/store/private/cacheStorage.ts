import type { FirstStoreAdapter } from "../StoreManager";
import { Logger } from "../../service/Logger";
import type { State } from "../state";
import { StoreManager } from "../StoreManager";
import { storageFileName as cacheName } from "../../secrets";
import { createCacheWorkerClient } from "../../workers/CacheWorkerClient";
import { validateOrDefaultsToState } from "../state";

const workerClient = createCacheWorkerClient(cacheName);

const getStateFromCache = (): Promise<State> =>
  workerClient
    .read()
    .then((jsonData) => (jsonData ? JSON.parse(jsonData) : undefined))
    .then(validateOrDefaultsToState);

const setStateInCache = (state: State): Promise<void> =>
  workerClient.write(JSON.stringify(state));

export const clearCache = () => workerClient.terminate();

export const CacheStorageAdapter: FirstStoreAdapter<State> = {
  initializer: () => workerClient.init().then(getStateFromCache),
  onStateChange: (state) => {
    if (StoreManager.hasData(state)) {
      setStateInCache(state.data).catch((error) => {
        Logger.error("Failed to persist state to cache")(error);
      });
    }
  },
};
