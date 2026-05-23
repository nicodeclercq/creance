import {
  type AuthManager,
  type Credentials,
  getDefaultAuthManager,
} from "./adapters/AuthManager";
import { BehaviorSubject } from "rxjs";
import { uid } from "../service/crypto";

export type StoreState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; error: Error };

type StoreManager<T, Item> = {
  register: (adapter: Adapter<T> | RemoteAdapter<T, Item>) => () => void;
  init: () => Promise<void>;
  getState: () => StoreState<T>;
  stateSubject: BehaviorSubject<StoreState<T>>;
  subscribe: (callback: (state: StoreState<T>) => void) => () => void;
  updateState: (update: StateUpdate<T>) => void;
  login: (credentials?: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchRemoteItem: (id: string, passKey: string) => Promise<Item>;
};

type StateUpdate<T> = T | ((current: T) => T);

export type Adapter<T> = {
  load: (prev: T | undefined) => Promise<T | undefined> | T | undefined;
  onChange: (state: T) => void;
  change?: (update: StateUpdate<T>) => void;
  onLogout?: () => void;
};

export type RemoteAdapter<T, Item> = Adapter<T> & {
  login: (credentials: Credentials) => Promise<string | Error>;
  signup: (credentials: Credentials) => Promise<string | Error>;
  logout: () => Promise<void>;
  fetchItem: (id: string, passKey: string) => Promise<Item>;
};

const isRemoteAdapter = <T, Item>(
  adapter: Adapter<T> | RemoteAdapter<T, Item>,
): adapter is RemoteAdapter<T, Item> =>
  "login" in adapter && "signup" in adapter && "logout" in adapter;

const applyStateUpdate = <T extends unknown>(
  current: T,
  update: StateUpdate<T>,
): T =>
  typeof update === "function"
    ? (update as (current: T) => T)(current)
    : update;

const createLoadingState = <T>(): StoreState<T> => ({
  status: "loading",
});
const createReadyState = <T>(data: T): StoreState<T> => ({
  status: "ready",
  data,
});
const createErrorState = <T>(error: Error): StoreState<T> => ({
  status: "error",
  error,
});

export type RunAdaptersCascadeResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

export const runAdaptersCascade = async <T>(
  adapters: Adapter<T>[],
  initialState: T | undefined,
): Promise<RunAdaptersCascadeResult<T>> => {
  return adapters
    .reduce<Promise<{ state: T | undefined; hasSucceeded: boolean }>>(
      (
        acc,
        adapter,
      ): Promise<{ state: T | undefined; hasSucceeded: boolean }> =>
        acc
          .then(({ state, hasSucceeded }) =>
            Promise.resolve(state)
              .then(adapter.load)
              .then((result: T | undefined) =>
                result !== undefined
                  ? {
                      state: result,
                      hasSucceeded: true,
                    }
                  : { state, hasSucceeded },
              ),
          )
          .catch((error) => {
            // Log and skip failed adapter
            console.error("[StoreManager] Adapter load failed:", error);
            return acc;
          }),
      Promise.resolve({ state: initialState, hasSucceeded: false }),
    )
    .then(({ state, hasSucceeded }) => {
      if (
        state === undefined ||
        (!hasSucceeded && initialState === undefined)
      ) {
        return {
          success: false,
          error: new Error("All adapters failed to initialize"),
        };
      }

      return { success: true, data: state };
    });
};

export const createStore = <T, Item>(config?: {
  authManager?: AuthManager;
  defaultState?: T;
}): StoreManager<T, Item> => {
  const authManager = config?.authManager ?? getDefaultAuthManager();
  const stateSubject = new BehaviorSubject<StoreState<T>>(createLoadingState());
  const adapters: Adapter<T>[] = [];
  const remoteAdapters: RemoteAdapter<T, Item>[] = [];
  let isInitialized = false;
  let currentChangeId = uid();
  let isNotifying = false;
  const remoteItemFetchers: Array<
    (id: string, passKey: string) => Promise<Item>
  > = [];

  const notifyAdapters = ({
    data,
    excludedAdapter,
  }: {
    data: T;
    excludedAdapter?: Adapter<T>;
  }) => {
    if (isNotifying) {
      return;
    }
    isNotifying = true;
    adapters.forEach((adapter) => {
      if (adapter !== excludedAdapter) {
        adapter.onChange(data);
      }
    });
    isNotifying = false;
  };

  const handleLateRegistration = (adapter: Adapter<T>): (() => void) => {
    const currentState = stateSubject.getValue();
    const prevData =
      currentState.status === "ready" ? currentState.data : undefined;
    const changeIdAtStart = currentChangeId;

    Promise.resolve(adapter.load(prevData))
      .then((result) => {
        // Check if this change is still valid (not cancelled)
        if (changeIdAtStart !== currentChangeId) {
          return;
        }

        if (result !== undefined) {
          stateSubject.next(createReadyState(result));
          notifyAdapters({ data: result, excludedAdapter: adapter });
        }
      })
      .catch((error) => {
        console.error("[StoreManager] Late adapter init failed:", error);
      });

    const subscription = stateSubject.subscribe((state) => {
      if (state.status === "ready") {
        adapter.onChange(state.data);
      }
    });

    // Clean up subscription after init completes (handled by unregister)
    const originalUnregister = () => {
      const index = adapters.indexOf(adapter);
      if (index !== -1) {
        adapters.splice(index, 1);
      }
      subscription.unsubscribe();
    };

    return originalUnregister;
  };

  const registerLocal = (adapter: Adapter<T>): (() => void) => {
    adapters.push(adapter);

    return isInitialized
      ? handleLateRegistration(adapter)
      : () => {
          const index = adapters.indexOf(adapter);
          if (index !== -1) {
            adapters.splice(index, 1);
          }
        };
  };

  const registerRemote = (adapter: RemoteAdapter<T, Item>): (() => void) => {
    remoteAdapters.push(adapter);
    remoteItemFetchers.push(adapter.fetchItem);

    const unregisterAdapter = registerLocal(adapter);

    if (isInitialized) {
      Promise.resolve()
        .then(() => authManager.loginAdapter(adapter.login))
        .catch((error) => {
          console.error(
            "[StoreManager] Late remote adapter login failed:",
            error,
          );
        });
    }

    return () => {
      const adapterIndex = remoteAdapters.indexOf(adapter);
      const fetcherIndex = remoteItemFetchers.indexOf(adapter.fetchItem);
      if (adapterIndex !== -1) {
        remoteAdapters.splice(adapterIndex, 1);
      }
      if (fetcherIndex !== -1) {
        remoteItemFetchers.splice(fetcherIndex, 1);
      }

      unregisterAdapter();
    };
  };

  const register = (
    adapter: Adapter<T> | RemoteAdapter<T, Item>,
  ): (() => void) => {
    const change = (update: StateUpdate<T>) => {
      const currentState = stateSubject.getValue();

      if (currentState.status !== "ready") {
        return;
      }

      currentChangeId = uid();

      const newData = applyStateUpdate(currentState.data, update);
      stateSubject.next(createReadyState(newData));

      notifyAdapters({ data: newData, excludedAdapter: adapter });
    };

    adapter.change = change;

    return isRemoteAdapter(adapter)
      ? registerRemote(adapter)
      : registerLocal(adapter);
  };

  const init = async (): Promise<void> => {
    await authManager.init();
    const result = await runAdaptersCascade(adapters, config?.defaultState);

    if (result.success) {
      stateSubject.next(createReadyState(result.data));
      isInitialized = true;
      notifyAdapters({ data: result.data });
    } else {
      stateSubject.next(createErrorState(result.error));
    }
  };

  const getState = (): StoreState<T> => stateSubject.getValue();

  const subscribe = (
    callback: (state: StoreState<T>) => void,
  ): (() => void) => {
    const subscription = stateSubject.subscribe(callback);
    return () => subscription.unsubscribe();
  };

  const updateState = (update: StateUpdate<T>): void => {
    const currentState = stateSubject.getValue();
    if (currentState.status !== "ready") {
      return;
    }

    const newData = applyStateUpdate(currentState.data, update);
    stateSubject.next(createReadyState(newData));
    notifyAdapters({ data: newData });
  };

  const reloadRemoteAdapters = (): void => {
    const currentState = stateSubject.getValue();
    const prevData =
      currentState.status === "ready" ? currentState.data : undefined;

    remoteAdapters.forEach((adapter) => {
      const changeIdAtStart = currentChangeId;
      Promise.resolve(adapter.load(prevData))
        .then((result) => {
          if (changeIdAtStart !== currentChangeId) {
            return;
          }

          if (result !== undefined) {
            stateSubject.next(createReadyState(result));
            notifyAdapters({ data: result, excludedAdapter: adapter });
          }
        })
        .catch((error) => {
          console.error("[StoreManager] Remote adapter reload failed:", error);
        });
    });
  };

  const fanOutLogin =
    (method: "login" | "signup") =>
    (credentials: Credentials): Promise<void> =>
      remoteAdapters.length === 0
        ? Promise.resolve()
        : Promise.all(
            remoteAdapters.map((adapter) => adapter[method](credentials)),
          ).then((results) => {
            const hasSuccess = results.some(
              (r): r is string => !(r instanceof Error),
            );
            if (!hasSuccess) {
              throw (
                results.find((r): r is Error => r instanceof Error) ??
                new Error("All remote adapters failed")
              );
            }
          });

  const login = (credentials?: Credentials): Promise<void> => {
    if (credentials == null) {
      return authManager.login().then(() => {});
    }

    return fanOutLogin("login")(credentials)
      .then(() => authManager.login(credentials))
      .then((authState) => {
        if (authState.type === "authenticated") {
          reloadRemoteAdapters();
        }
      });
  };

  const signup = (credentials: Credentials): Promise<void> =>
    fanOutLogin("signup")(credentials)
      .then(() => authManager.login(credentials))
      .then((authState) => {
        if (authState.type === "authenticated") {
          reloadRemoteAdapters();
        }
      });

  const teardownAdapters = () => {
    return Promise.all(
      remoteAdapters.map((adapter) =>
        adapter.logout().catch((error) => {
          console.error("[StoreManager] Remote logout failed:", error);
        }),
      ),
    ).then(() => {
      adapters.forEach((adapter) => {
        adapter.onLogout?.();
      });
    });
  };

  const reinitialize = () => {
    stateSubject.next(createLoadingState());
    isInitialized = false;
    init();
  };

  const logout = (): Promise<void> => {
    authManager.logout();
    return teardownAdapters().then(reinitialize);
  };

  const fetchRemoteItem = (id: string, passKey: string) => {
    if (remoteItemFetchers.length === 0) {
      return Promise.reject("No remote adapter setup");
    }

    return Promise.race(
      remoteItemFetchers.map((fetcher) => fetcher(id, passKey)),
    );
  };

  return {
    register,
    init,
    getState,
    stateSubject,
    subscribe,
    updateState,
    login,
    signup,
    logout,
    fetchRemoteItem,
  };
};
