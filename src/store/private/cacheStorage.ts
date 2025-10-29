import * as Either from "fp-ts/Either";

import { fromState, toState } from "../../adapters/json";

import type { FirstStoreAdapter } from "../StoreManager";
import { Logger } from "../../service/Logger";
import type { State } from "../state";
import { StoreManager } from "../StoreManager";
import { storageFileName as cacheName } from "../../secrets";
import { createCacheWorkerClient } from "../../workers/CacheWorkerClient";
import { pipe } from "fp-ts/function";
import { validateOrDefaultsToState } from "../state";

const workerClient = createCacheWorkerClient(cacheName);

const getStateFromCache = (): Promise<Either.Either<Error, State>> =>
  workerClient
    .read()
    .then((jsonData) =>
      pipe(
        Either.tryCatch(
          () => JSON.parse(jsonData),
          (error) => error as Error
        ),
        Either.chainW(toState)
      )
    )
    .catch((error) => Either.left(error as Error));

const setStateInCache = (state: State): Promise<void> =>
  workerClient.write(fromState(state)).catch((error) => {
    Logger.error("Unable to write state to cache")(error);
  });

export const clearCache = () => workerClient.terminate();

export const CacheStorageAdapter: FirstStoreAdapter<State> = {
  initializer: () =>
    workerClient
      .init()
      .then(getStateFromCache)
      .then(
        Either.getOrElseW((error) => {
          Logger.error("Unable to get state from cache")(error);
          Logger.info("Using default state")();
          return validateOrDefaultsToState(undefined);
        })
      )
      .catch((error) => {
        Logger.error("Unable to initialize cache storage")(error);
        Logger.info("Using default state")();
        return validateOrDefaultsToState(undefined);
      }),
  onStateChange: (state) => {
    if (StoreManager.hasData(state)) {
      setStateInCache(state.data).catch((error) => {
        Logger.error("Failed to persist state to cache")(error);
      });
    }
  },
};
