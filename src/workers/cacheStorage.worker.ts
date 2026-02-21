export type CacheStorageMessage =
  | { type: "init"; name: string }
  | { type: "read"; name: string }
  | { type: "write"; name: string; data: string }
  | { type: "clear"; name: string };

export type CacheStorageResponse =
  | { type: "init-success" }
  | { type: "init-error"; error: string }
  | { type: "read-success"; data: string }
  | { type: "read-empty" }
  | { type: "read-error"; error: string }
  | { type: "write-success" }
  | { type: "write-error"; error: string }
  | { type: "clear-success" }
  | { type: "clear-error"; error: string };

const STORAGE_KEY = "state";

self.onmessage = (event: MessageEvent<CacheStorageMessage>): void => {
  const message = event.data;

  const handler = (() => {
    switch (message.type) {
      case "init":
        return init(message.name);
      case "read":
        return read(message.name);
      case "write":
        return write(message.name, message.data);
      case "clear":
        return clear(message.name);
      default:
        return Promise.reject(new Error("Unknown message type"));
    }
  })();

  handler.catch((error) => postError(message.type, error));
};

function init(name: string): Promise<void> {
  if (!("caches" in self)) {
    return Promise.reject(new Error("CacheStorage API is not supported"));
  }

  return caches
    .open(name)
    .then(() =>
      postMessage({ type: "init-success" } satisfies CacheStorageResponse)
    )
    .catch((error) => {
      postMessage({
        type: "init-error",
        error: error.message,
      } satisfies CacheStorageResponse);
    });
}

function read(name: string): Promise<void> {
  if (!name) {
    return Promise.reject(new Error("Cache not initialized. Call init first."));
  }

  return caches
    .open(name)
    .then((cache) => cache.match(STORAGE_KEY))
    .then((response) => (response ? response.text() : undefined))
    .then((text) =>
      postMessage(
        text
          ? ({ type: "read-success", data: text } satisfies CacheStorageResponse)
          : ({ type: "read-empty" } satisfies CacheStorageResponse),
      ),
    )
    .catch((error) => {
      postMessage({
        type: "read-error",
        error: error.message,
      } satisfies CacheStorageResponse);
    });
}

function write(name: string, data: string): Promise<void> {
  if (!name) {
    return Promise.reject(new Error("Cache not initialized. Call init first."));
  }

  const response = new Response(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  return caches
    .open(name)
    .then((cache) => cache.put(STORAGE_KEY, response))
    .then(() => {
      postMessage({ type: "write-success" } satisfies CacheStorageResponse);
    })
    .catch((error) => {
      postMessage({
        type: "write-error",
        error: error.message,
      } satisfies CacheStorageResponse);
    });
}

function clear(name: string): Promise<void> {
  if (!name) {
    return Promise.reject(new Error("Cache not initialized. Call init first."));
  }

  return caches
    .delete(name)
    .then(() => {
      postMessage({ type: "clear-success" } satisfies CacheStorageResponse);
    })
    .catch((error) => {
      postMessage({
        type: "clear-error",
        error: error.message,
      } satisfies CacheStorageResponse);
    });
}

function postError(messageType: string, error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (messageType === "init") {
    postMessage({
      type: "init-error",
      error: errorMessage,
    } satisfies CacheStorageResponse);
  } else if (messageType === "read") {
    postMessage({
      type: "read-error",
      error: errorMessage,
    } satisfies CacheStorageResponse);
  } else if (messageType === "write") {
    postMessage({
      type: "write-error",
      error: errorMessage,
    } satisfies CacheStorageResponse);
  }
}
