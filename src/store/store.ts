import { DEFAULT_STATE } from "./state";
import type { Event } from "../models/Event";
import { InitTasksAdapter } from "./adapters/createInitTasksAdapter";
import type { State } from "./state";
import { createCacheAdapter } from "./adapters/createCacheAdapter";
import { createFirebaseAdapter } from "./adapters/createFirebaseAdapter";
import { createStore } from "./createStore";
import { storageFileName } from "../secrets";

const STORAGE_KEY = `creance-${storageFileName}`;

const CacheStorageAdapter = createCacheAdapter({
  cacheName: STORAGE_KEY,
});
const FirebaseAdapter = createFirebaseAdapter();

export const store = createStore<State, Event>({ defaultState: DEFAULT_STATE });
store.register(CacheStorageAdapter);
store.register(FirebaseAdapter);
store.register(InitTasksAdapter);
store.init();
