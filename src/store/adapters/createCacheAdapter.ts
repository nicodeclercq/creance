import type { Adapter } from "../createStore";
import type { State } from "../state";
import { createCacheWorkerClient } from "../../workers/CacheWorkerClient";
import { createLocalAdapter } from "./createLocalAdapter";

export type CacheAdapterConfig = {
  cacheName: string;
};

export const createCacheAdapter = (
  config: CacheAdapterConfig,
): Adapter<State> => {
  const workerClient = createCacheWorkerClient(config.cacheName);
  let initialized = false;

  return createLocalAdapter({
    name: "CacheAdapter",

    read: () =>
      (initialized ? Promise.resolve() : workerClient.init()).then(() => {
        initialized = true;
        return workerClient.read();
      }),

    write: (data) =>
      (initialized ? Promise.resolve() : workerClient.init()).then(() => {
        initialized = true;
        return workerClient.write(data);
      }),

    clear: () => {
      workerClient.clear().catch(() => {});
    },
  });
};
