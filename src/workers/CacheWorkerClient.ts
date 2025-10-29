import type {
  CacheStorageMessage,
  CacheStorageResponse,
} from "./cacheStorage.worker";

import CacheStorageWorker from "./cacheStorage.worker?worker";
import { Logger } from "../service/Logger";
import { validateOrDefaultsToState } from "../store/state";

const getRequestIdFromResponse = (response: CacheStorageResponse): string =>
  response.type.replace(/-success|-error/, "");

export const createCacheWorkerClient = (name: string) => {
  const worker = new CacheStorageWorker();

  const pendingRequests = new Map<
    string,
    {
      resolve: (value: CacheStorageResponse) => void;
      reject: (error: Error) => void;
    }
  >();

  const handleResponse = (response: CacheStorageResponse): void => {
    const requestId = getRequestIdFromResponse(response);
    const pending = pendingRequests.get(requestId);

    if (pending) {
      pendingRequests.delete(requestId);
      pending.resolve(response);
    }
  };

  const sendMessage = (
    message: CacheStorageMessage
  ): Promise<CacheStorageResponse> =>
    new Promise((resolve, reject) => {
      const requestId = message.type;
      pendingRequests.set(requestId, { resolve, reject });

      // Set a timeout to prevent hanging requests
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error(`Request timeout for ${requestId}`));
        }
      }, 10000); // 10 second timeout

      worker.postMessage(message);
    });

  const init = (): Promise<void> =>
    sendMessage({
      type: "init",
      name,
      defaultState: JSON.stringify(validateOrDefaultsToState(undefined)),
    }).then((response) => {
      if (response.type === "init-error") {
        throw new Error(response.error);
      }
    });

  const read = (): Promise<string> =>
    sendMessage({ type: "read", name }).then((response) => {
      if (response.type === "read-error") {
        throw new Error(response.error);
      }
      if (response.type === "read-success") {
        if (!response.data) {
          write(JSON.stringify(validateOrDefaultsToState(undefined)));
          return read();
        }
        return response.data;
      }
      throw new Error("Unexpected response type");
    });

  const write = (data: string): Promise<void> =>
    sendMessage({ type: "write", name, data }).then((response) => {
      if (response.type === "write-error") {
        throw new Error(response.error);
      }
    });

  const terminate = (): void => {
    worker.terminate();
    pendingRequests.clear();
  };

  const clear = (): Promise<void> =>
    sendMessage({ type: "clear", name }).then((response) => {
      if (response.type === "clear-error") {
        throw new Error(response.error);
      }
    });

  worker.onmessage = (event: MessageEvent<CacheStorageResponse>) => {
    handleResponse(event.data);
  };

  worker.onerror = (error) => {
    Logger.error("CacheStorage worker error")(error);
    pendingRequests.forEach(({ reject }) => {
      reject(new Error("Worker error"));
    });
    pendingRequests.clear();
  };

  return {
    init,
    read,
    write,
    clear,
    terminate,
  };
};
