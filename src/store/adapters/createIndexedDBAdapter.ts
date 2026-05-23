import type { AuthManager } from "./AuthManager";
import type { Event } from "../../models/Event";
import { Logger } from "../../service/Logger";
import { Observable } from "rxjs";
import type { RemoteAdapter } from "../createStore";
import type { State } from "../state";
import { createRemoteAdapter } from "./createRemoteAdapter";
import { pipe } from "fp-ts/function";

const DB_NAME = "creance-db";
const DB_VERSION = 1;
const USERS_STORE = "users";
const EVENTS_STORE = "events";
const USER_ID_STORAGE_KEY = "creance-idb-uid";

const TEST_LOGIN = "login";
const TEST_PASSWORD = "password";

const POLL_INTERVAL = 1000;

type IndexedDBState = {
  db: IDBDatabase | undefined;
  userId: string | undefined;
  latestUserData: string | undefined;
  latestEventData: Record<string, string | undefined>;
};

const readPersistedUserId = (): string | undefined => {
  const stored = localStorage.getItem(USER_ID_STORAGE_KEY);
  return stored ? stored : undefined;
};

const persistUserId = (userId: string | undefined): void =>
  userId
    ? localStorage.setItem(USER_ID_STORAGE_KEY, userId as string)
    : localStorage.removeItem(USER_ID_STORAGE_KEY);

export const createIndexedDBAdapter = (config?: {
  authManager?: AuthManager;
}): RemoteAdapter<State, Event> => {
  const state: IndexedDBState = {
    db: undefined,
    userId: readPersistedUserId(),
    latestUserData: undefined,
    latestEventData: {},
  };

  const openDatabase = (): Promise<IDBDatabase> =>
    state.db
      ? Promise.resolve(state.db)
      : new Promise((resolve, reject) => {
          const request = indexedDB.open(DB_NAME, DB_VERSION);

          request.onerror = () => reject(request.error);

          request.onsuccess = () => {
            state.db = request.result;
            resolve(request.result);
          };

          request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(USERS_STORE)) {
              db.createObjectStore(USERS_STORE);
            }
            if (!db.objectStoreNames.contains(EVENTS_STORE)) {
              db.createObjectStore(EVENTS_STORE);
            }
          };
        });

  const getUserId = (login: string) =>
    pipe(
      new TextEncoder(),
      (encoder) => encoder.encode(`user:${login}`),
      (data) =>
        Array.from(data)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .substring(0, 24),
    );

  const login = ({
    login,
    password,
  }: {
    login: string;
    password: string;
  }): Promise<string | Error> => {
    if (login !== TEST_LOGIN && password !== TEST_PASSWORD) {
      return Promise.resolve(new Error("Invalid credentials"));
    }

    state.userId = getUserId(login);
    persistUserId(state.userId);
    return Promise.resolve(state.userId);
  };

  const signup = ({
    login: _login,
  }: {
    login: string;
    password: string;
  }): Promise<string | Error> => {
    state.userId = getUserId(TEST_LOGIN);
    persistUserId(state.userId);
    return Promise.resolve(state.userId);
  };

  const logout = (): Promise<void> => {
    state.userId = undefined;
    persistUserId(undefined);

    return state.db
      ? new Promise((resolve, reject) => {
          const transaction = state.db!.transaction(
            [USERS_STORE, EVENTS_STORE],
            "readwrite",
          );
          const usersStore = transaction.objectStore(USERS_STORE);
          const eventsStore = transaction.objectStore(EVENTS_STORE);

          usersStore.clear();
          eventsStore.clear();

          transaction.onerror = () => {
            Logger.error("IndexedDB: logout failed")(transaction.error);
            reject();
          };
          transaction.oncomplete = () => resolve();
        })
      : Promise.resolve();
  };

  const readUserData = (): Promise<string | undefined> => {
    const userId = state.userId;
    if (!userId) return Promise.resolve(undefined);

    return openDatabase().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(USERS_STORE, "readonly");
          const objectStore = transaction.objectStore(USERS_STORE);
          const request = objectStore.get(userId);

          request.onerror = () => reject(request.error);
          request.onsuccess = () =>
            resolve(request.result as string | undefined);
        }),
    );
  };

  const setUserData = (encryptedData: string): Promise<void> => {
    const userId = state.userId;
    if (!userId) return Promise.resolve();

    return openDatabase().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(USERS_STORE, "readwrite");
          const objectStore = transaction.objectStore(USERS_STORE);
          const request = objectStore.put(encryptedData, userId);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            state.latestUserData = encryptedData;
            resolve();
          };
        }),
    );
  };

  const getUserData = (): Observable<string | undefined> =>
    new Observable((subscriber) => {
      readUserData()
        .then((data) => {
          state.latestUserData = data;
          subscriber.next(data);
        })
        .catch((error) => subscriber.error(error));

      const intervalId = setInterval(() => {
        readUserData()
          .then((data) => {
            if (data !== state.latestUserData) {
              state.latestUserData = data;
              subscriber.next(data);
            }
          })
          .catch((error) => subscriber.error(error));
      }, POLL_INTERVAL);

      return () => clearInterval(intervalId);
    });

  const readEventData = (eventId: string): Promise<string | undefined> =>
    openDatabase().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(EVENTS_STORE, "readonly");
          const objectStore = transaction.objectStore(EVENTS_STORE);
          const request = objectStore.get(eventId);

          request.onerror = () => reject(request.error);
          request.onsuccess = () =>
            resolve(request.result as string | undefined);
        }),
    );

  const setEventData = (
    eventId: string,
    encryptedData: string,
  ): Promise<void> =>
    openDatabase().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(EVENTS_STORE, "readwrite");
          const objectStore = transaction.objectStore(EVENTS_STORE);
          const request = objectStore.put(encryptedData, eventId);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            state.latestEventData[eventId] = encryptedData;
            resolve();
          };
        }),
    );

  const deleteEventData = (eventId: string): Promise<void> =>
    openDatabase().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(EVENTS_STORE, "readwrite");
          const objectStore = transaction.objectStore(EVENTS_STORE);
          const request = objectStore.delete(eventId);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            delete state.latestEventData[eventId];
            resolve();
          };
        }),
    );

  const getEventData = (eventId: string): Observable<string | undefined> =>
    new Observable((subscriber) => {
      readEventData(eventId)
        .then((data) => {
          state.latestEventData[eventId] = data;
          subscriber.next(data);
        })
        .catch((error) => subscriber.error(error));

      const intervalId = setInterval(() => {
        readEventData(eventId)
          .then((data) => {
            if (data !== state.latestEventData[eventId]) {
              state.latestEventData[eventId] = data;
              subscriber.next(data);
            }
          })
          .catch((error) => subscriber.error(error));
      }, POLL_INTERVAL);

      return () => clearInterval(intervalId);
    });

  return createRemoteAdapter({
    operations: {
      name: "IndexedDB",
      login,
      signup,
      logout,
      getUserData,
      setUserData,
      getEventData,
      setEventData,
      deleteEventData,
    },
    authManager: config?.authManager,
  });
};
