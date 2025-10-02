import * as Either from "fp-ts/Either";
import { identity } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import * as RX from "rxjs";
import * as z from "zod";

import {
  DatabaseReference,
  DataSnapshot,
  get,
  getDatabase,
  onValue,
  ref,
  set,
} from "firebase/database";

import { type ZodSchema } from "zod";
import { firebaseConfig } from "../../secrets";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { pipe } from "fp-ts/function";

import { DEFAULT_STATE, State } from "../state";
import { decrypt, generateKey } from "../../service/crypto";
import { Account, accountSchema } from "../../models/Account";
import { Store, StoreAdapter, StoreManager } from "../StoreManager";
import { Fn } from "../../helpers/function";
import { Logger } from "../../service/Logger";

type Schema<Data> = ZodSchema<Data, any, any>;
const LOCAL_STORAGE_KEY = "userKey";

export const COLLECTIONS = {
  EVENTS: firebaseConfig.collections.EVENTS,
  USERS: firebaseConfig.collections.USERS,
} as const;
type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type LoadtingState = {
  type: "loading";
};

type AuthenticatedState = {
  type: "authenticated";
  participantId: string;
  events: Record<string, Event>;
  users: Record<string, User>;
};

type UnauthenticatedState = {
  type: "unauthenticated";
};

export type AuthState =
  | LoadtingState
  | AuthenticatedState
  | UnauthenticatedState;

const listenToAuthChanges = (
  updateStore: (map: Fn<[Store<State>], Store<State>>) => void
): Promise<Store<State>> => {
  return new Promise((resolve) => {
    let isReady = false;

    onAuthStateChanged(auth, (user) => {
      const key = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (user?.uid && key != null) {
        get(ref(db, `${COLLECTIONS.USERS}/${user.uid}`))
          .then((snapshot) => (snapshot.exists() ? snapshot.val() : undefined))
          .then((data) => {
            if (data == null) {
              return Promise.resolve(
                Either.right(null) as Either.Either<Error, Account | null>
              );
            }
            return z.string().safeParse(data).success
              ? decrypt(data, key)
                  .then(fromFirebaseData(accountSchema))
                  .catch((error) => {
                    Logger.error("Failed to decrypt user data:")(error, data);
                    return Either.left(error);
                  })
              : Promise.reject(new Error("Failed to decrypt user data"));
          })
          .catch(
            (error: Error) =>
              Either.left(error) as Either.Either<Error, Account | null>
          )
          .then(
            Either.fold(
              (error) => {
                Logger.error("Error loading account data")(error);
                updateStore(() => ({ type: "error", error: error.message }));
              },
              (accountData) => {
                Logger.log(`User ${user.uid} authenticated with data:`)(
                  accountData
                );

                updateStore((store) => {
                  let newStore = store;
                  if (!isReady) {
                    isReady = true;
                    wait(100).then(() => resolve(newStore));
                  }

                  if (StoreManager.hasData(store)) {
                    newStore =
                      accountData != null
                        ? {
                            type: "authenticated",
                            data: {
                              ...store.data,
                              account: accountData,
                            },
                          }
                        : {
                            ...store,
                            type: "ready",
                          };
                  }

                  return newStore;
                });
              }
            )
          );
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    });
  });
};

const hasAccountChanged = (a: Account | null, b: Account | null): boolean => {
  if (a == null && b == null) return false;
  if (a == null || b == null) return true;
  return (
    a._id !== b._id ||
    a.name !== b.name ||
    a.events !== b.events ||
    JSON.stringify(a.events) !== JSON.stringify(b.events)
  );
};

const listenToRemoteCollection = <LocalData>(
  collection: DatabaseReference,
  adapter: (d: unknown) => Promise<LocalData> = identity as (
    d: unknown
  ) => Promise<LocalData>,
  onChange: (data: Either.Either<Error, LocalData>) => void
) => {
  const firebaseWatch = (): RX.Observable<Either.Either<Error, LocalData>> => {
    const $value = new RX.Subject<Either.Either<Error, LocalData>>();
    try {
      onValue(
        collection,
        (snapshot) =>
          pipe(
            snapshot,
            Either.fromPredicate(
              (s: DataSnapshot) => s.exists(),
              () =>
                new Error(
                  `No data found in Firebase for collection ${collection.toString()}`
                )
            ),
            Either.fold(
              (error) => {
                $value.next(Either.left(error));
              },
              (s) => {
                const result: unknown = s.val();

                adapter(result)
                  .then((adaptedData) => {
                    $value.next(Either.right(adaptedData));
                  })
                  .catch((error) => {
                    $value.next(
                      Either.left(
                        new Error(`Error processing snapshot: ${error}`)
                      )
                    );
                  });
              }
            )
          ),
        () => {
          $value.next(
            Either.left(
              new Error(
                `Error listening to changes in Firebase for collection ${collection.toString()}`
              )
            )
          );
        }
      );
    } catch (error) {}
    return $value;
  };

  firebaseWatch().subscribe({
    next: (data) => {
      onChange(data);
    },
    error: (error) => {
      Logger.error(
        `Error listening to changes in Firebase for collection ${collection.toString()}:`
      )(error);
    },
  });
};

const listenToRemoteChanges = <LocalData>(
  collectionName: CollectionName,
  adapter: (d: unknown) => Promise<LocalData> = identity as (
    d: unknown
  ) => Promise<LocalData>,
  onChange: (data: Either.Either<Error, LocalData>) => void
) => {
  const collectionRef = ref(db, collectionName);
  listenToRemoteCollection(collectionRef, adapter, onChange);
};

const toFirebaseData = <Data>(data: Data): Promise<string> =>
  Promise.resolve(data).then((a) => JSON.stringify(a));

const fromFirebaseData =
  <Data>(schema: Schema<Data>) =>
  (data: unknown): Promise<Either.Either<Error, Data>> => {
    return Promise.resolve(data)
      .then((data) => {
        const parsed = z.string().safeParse(data);
        if (!parsed.success) {
          throw new Error(`Failed to parse data: ${parsed.error}`);
        }
        return parsed.data;
      })
      .then((data) => JSON.parse(data))
      .then((data) => (typeof data === "string" ? JSON.parse(data) : data))
      .then((data) => schema.safeParse(data))
      .then((result) => {
        return result.success
          ? Either.right(result.data)
          : Either.left(result.error);
      })
      .catch((error) => {
        Logger.error("Failed to parse Firebase data:")(data);
        return Either.left(
          new Error(`Failed to parse Firebase data: ${error}`)
        );
      });
  };

function getAccountData(): Promise<Either.Either<Error, Account | null>> {
  return Promise.resolve()
    .then(() => auth.authStateReady())
    .then(() => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }
      return ref(db, `${COLLECTIONS.USERS}/${user.uid}`);
    })
    .then((collectionRef) => get(collectionRef))
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : undefined))
    .then((data) => {
      if (data == null) {
        return Promise.resolve(
          Either.right(null) as Either.Either<Error, Account | null>
        );
      }
      return z.string().safeParse(data).success
        ? decrypt(data, localStorage.getItem(LOCAL_STORAGE_KEY) ?? "").then(
            fromFirebaseData(accountSchema)
          )
        : Promise.reject(new Error("Failed to decrypt user data"));
    })
    .catch((error) => Either.left(error));
}

export function signUpParticipant({
  email,
  password,
}: {
  email: string;
  password: string;
}): TaskEither.TaskEither<Error, void> {
  return () =>
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => Either.right(undefined))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return Either.left(
          new Error(
            `Failed to create participant: ${errorCode} - ${errorMessage}`
          )
        );
      });
}

export function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): TaskEither.TaskEither<Error, void> {
  return () =>
    signInWithEmailAndPassword(auth, email, password)
      .then(() => generateKey(password))
      .then((key) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, key);
      })
      .then(getAccountData)
      .then((result) =>
        pipe(
          result,
          Either.fold(
            (error) => {
              Logger.error(`Error fetching account data for user:`)(error);
            },
            (data) => {
              if (data) {
                StoreManager.update((state) => ({
                  type: "authenticated",
                  account: data,
                  data: StoreManager.hasData(state)
                    ? state.data
                    : DEFAULT_STATE,
                }));
              }
            }
          )
        )
      )
      .then(() => Either.right(undefined));
}

export function logoutUser() {
  auth.signOut().then(() => {
    Object.values(COLLECTIONS).forEach((collectionName) => {
      localStorage.getItem(`lastUpdate_${collectionName}`);
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  });
}

function save<Data extends { _id: string }>({
  collectionName,
  transform = toFirebaseData,
  data,
}: {
  collectionName: CollectionName;
  transform?: (data: Data) => Promise<unknown>;
  data: Data;
}): Promise<void> {
  return Promise.resolve()
    .then(() => auth.authStateReady())
    .then(() => ref(db, `${collectionName}/${data._id}`))
    .then((collectionRef) =>
      transform(data).then((transformedData) =>
        set(collectionRef, transformedData)
      )
    );
}

function deleteData(collectionName: CollectionName, id: string) {
  const collectionRef = ref(db, `${collectionName}/${id}`);
  return set(collectionRef, null).catch((error) => {
    Logger.error(`Failed to delete data from collection ${collectionName}:`)(
      error
    );
  });
}

export const FirebaseAdapter: StoreAdapter<State> = {
  initializer: (state, updateStore) =>
    listenToAuthChanges(updateStore).then((store) =>
      StoreManager.hasData(store) ? store.data : state
    ),
  onStateChange: identity,
};
