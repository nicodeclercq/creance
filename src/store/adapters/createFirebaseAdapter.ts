import { Observable } from "rxjs";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  type Database,
} from "firebase/database";

import { Logger } from "../../service/Logger";
import { firebaseConfig } from "../../secrets";
import { createRemoteAdapter } from "./createRemoteAdapter";
import { createUserId, type UserId } from "./shared/alias";
import type { AuthManager } from "./AuthManager";
import type { RemoteAdapter } from "../createStore";
import type { State } from "../state";

const COLLECTIONS = {
  USERS: firebaseConfig.collections.USERS,
  EVENTS: firebaseConfig.collections.EVENTS,
} as const;

const USER_ID_STORAGE_KEY = "creance-fb-uid";

const readPersistedUserId = (): UserId | undefined => {
  const stored = localStorage.getItem(USER_ID_STORAGE_KEY);
  return stored ? createUserId(stored) : undefined;
};

const persistUserId = (userId: UserId | undefined): void =>
  userId
    ? localStorage.setItem(USER_ID_STORAGE_KEY, userId as string)
    : localStorage.removeItem(USER_ID_STORAGE_KEY);

type FirebaseServices = {
  app: FirebaseApp;
  db: Database;
  auth: Auth;
};

const getFirebase = (() => {
  const holder: { services: FirebaseServices | undefined } = {
    services: undefined,
  };
  return (): FirebaseServices => {
    holder.services ??= (() => {
      const app = initializeApp(firebaseConfig);
      return {
        app,
        db: getDatabase(app),
        auth: getAuth(app),
      };
    })();
    return holder.services;
  };
})();

type FirebaseState = {
  userId: UserId | undefined;
};

export const createFirebaseAdapter = (config?: {
  authManager?: AuthManager;
}): RemoteAdapter<State> => {
  const state: FirebaseState = {
    userId: readPersistedUserId(),
  };

  const login = ({
    login: email,
    password,
  }: {
    login: string;
    password: string;
  }): Promise<UserId | Error> => {
    const { auth } = getFirebase();
    return signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        const userId = createUserId(credential.user.uid);
        state.userId = userId;
        persistUserId(userId);
        return userId;
      })
      .catch((error: unknown) => {
        Logger.error("Firebase: login failed")(error);
        return error instanceof Error ? error : new Error(String(error));
      });
  };

  const signup = ({
    login: email,
    password,
  }: {
    login: string;
    password: string;
  }): Promise<UserId | Error> => {
    const { auth } = getFirebase();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        const userId = createUserId(credential.user.uid);
        state.userId = userId;
        persistUserId(userId);
        return userId;
      })
      .catch((error: unknown) => {
        Logger.error("Firebase: signup failed")(error);
        return error instanceof Error ? error : new Error(String(error));
      });
  };

  const logout = (): Promise<void> => {
    const { auth } = getFirebase();
    state.userId = undefined;
    persistUserId(undefined);
    return signOut(auth).catch((error: unknown) => {
      Logger.error("Firebase: logout failed")(error);
    });
  };

  const getUserData = (): Observable<string | undefined> =>
    new Observable((subscriber) => {
      const { db } = getFirebase();
      const userId = state.userId;

      if (!userId) {
        subscriber.next(undefined);
        return () => {};
      }

      const userRef = ref(db, `${COLLECTIONS.USERS}/${userId}`);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          subscriber.next(
            snapshot.exists() ? (snapshot.val() as string) : undefined,
          );
        },
        (error) => {
          Logger.error("Firebase: getUserData subscription error")(error);
          subscriber.error(error);
        },
      );

      return () => unsubscribe();
    });

  const setUserData = (encryptedData: string): Promise<void> => {
    const { db } = getFirebase();
    const userId = state.userId;

    if (!userId) return Promise.resolve();

    const userRef = ref(db, `${COLLECTIONS.USERS}/${userId}`);
    return set(userRef, encryptedData).catch((error: unknown) => {
      Logger.error("Firebase: setUserData failed")(error);
      throw error;
    });
  };

  const getEventData = (eventId: string): Observable<string | undefined> =>
    new Observable((subscriber) => {
      const { db } = getFirebase();
      const eventRef = ref(db, `${COLLECTIONS.EVENTS}/${eventId}`);

      const unsubscribe = onValue(
        eventRef,
        (snapshot) => {
          subscriber.next(
            snapshot.exists() ? (snapshot.val() as string) : undefined,
          );
        },
        (error) => {
          Logger.error("Firebase: getEventData subscription error")(error);
          subscriber.error(error);
        },
      );

      return () => unsubscribe();
    });

  const setEventData = (
    eventId: string,
    encryptedData: string,
  ): Promise<void> => {
    const { db } = getFirebase();
    const eventRef = ref(db, `${COLLECTIONS.EVENTS}/${eventId}`);
    return set(eventRef, encryptedData).catch((error: unknown) => {
      Logger.error("Firebase: setEventData failed")(error);
      throw error;
    });
  };

  const deleteEventData = (eventId: string): Promise<void> => {
    const { db } = getFirebase();
    const eventRef = ref(db, `${COLLECTIONS.EVENTS}/${eventId}`);
    return remove(eventRef).catch((error: unknown) => {
      Logger.error("Firebase: deleteEventData failed")(error);
      throw error;
    });
  };

  return createRemoteAdapter({
    operations: {
      name: "Firebase",
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
