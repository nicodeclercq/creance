import * as Either from "fp-ts/Either";
import * as ArrayFP from "fp-ts/Array";
import { identity, constVoid } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import * as RecordFP from "fp-ts/Record";
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
import { firebaseConfig } from "../secrets";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { pipe, flow } from "fp-ts/function";
import { accountSchema, eventSchema } from "../adapters/json";
import { State } from "../store/state";
import { Path, ValueFromPath } from "../store/store";
import { synchronize } from "./synchronize";
import { decrypt, encrypt, generateKey } from "./crypto";
import { Account } from "../models/Account";
import { update as updataLocalStore } from "../store/StoreProvider";

type Schema<Data> = ZodSchema<Data, any, any>;
const LOCAL_STORAGE_KEY = "userKey";

export const COLLECTIONS = {
  EVENTS: firebaseConfig.collections.EVENTS,
  USERS: firebaseConfig.collections.USERS,
} as const;
type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

const log =
  (message: string) =>
  <A>(a: A): A => {
    console.log(message, a);
    return a;
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

type LoadtingState = {
  type: "loading";
};
type AuthenticatedState = {
  type: "authenticated";
  participantId: string;
};
type UnauthenticatedState = {
  type: "unauthenticated";
};
export type AuthState =
  | LoadtingState
  | AuthenticatedState
  | UnauthenticatedState;

export const $isAuthenticated = new RX.BehaviorSubject<AuthState>({
  type: "loading",
});
onAuthStateChanged(auth, (user) => {
  if (user?.uid && localStorage.getItem(LOCAL_STORAGE_KEY) != null) {
    get(ref(db, `${COLLECTIONS.USERS}/${user.uid}`))
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
      .then(
        Either.fold(
          (error) => {
            console.log(error);
          },
          (accountData) => {
            updateStoreWithAccountData(accountData);

            if ($isAuthenticated.value.type !== "authenticated") {
              $isAuthenticated.next({
                type: "authenticated",
                participantId: user.uid,
              });
            }
          }
        )
      )
      .catch((error) => Either.left(error));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    $isAuthenticated.next({ type: "unauthenticated" });
  }
});

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
      console.error(
        `Error listening to changes in Firebase for collection ${collection.toString()}:`,
        error
      );
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
        console.error("Failed to parse Firebase data:", data);
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

function updateStoreWithAccountData(data: Account | undefined | null) {
  if (data == null) {
    return;
  }
  updataLocalStore("account")((oldData) => ({
    ...oldData,
    ...data,
    events: {
      ...oldData?.events,
      ...data.events,
    },
  }));
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
              console.error(`Error fetching account data for user:`, error);
            },
            (data) => {
              updateStoreWithAccountData(data);
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

type Diff<Data> = {
  created: Record<string, Data>;
  unchanged: Record<string, Data>;
  updated: Record<string, Data>;
  deleted: Record<string, Data>;
};

function mergeDataFromDiff<Data>(diff: Diff<Data>): Record<string, Data> {
  return {
    ...diff.created,
    ...diff.unchanged,
    ...diff.updated,
  };
}

function deleteData(collectionName: CollectionName, id: string) {
  const collectionRef = ref(db, `${collectionName}/${id}`);
  return set(collectionRef, null).catch((error) => {
    console.error(
      `Failed to delete data from collection ${collectionName}:`,
      error
    );
  });
}

function getRemoteStore<Data>(
  collectionName: CollectionName,
  adapter: (data: unknown) => Promise<Data>
): RX.Observable<Data | undefined> {
  type Loading = { type: "loading" };
  type Loaded = { type: "loaded"; data: Data };
  type Errored = { type: "errored" };
  type State = Loading | Loaded | Errored;
  const isLoaded = (state: State): state is Loaded => state.type === "loaded";
  const isError = (state: State): state is Errored => state.type === "errored";

  const $remoteStore = new RX.BehaviorSubject<State>({ type: "loading" });

  listenToRemoteChanges<Data>(
    collectionName,
    adapter,
    flow(
      Either.fold(
        (error) => {
          console.error(
            `Error listening to changes in collection ${collectionName}:`,
            error
          );
          $remoteStore.next({ type: "errored" });
        },
        (newRemoteData: Data) => {
          $remoteStore.next({
            type: "loaded",
            data: newRemoteData,
          });
        }
      )
    )
  );

  return RX.combineLatest([
    $remoteStore.asObservable(),
    $isAuthenticated
      .asObservable()
      .pipe(RX.map((state) => (state.type === "authenticated" ? true : false))),
  ]).pipe(
    RX.filter(
      ([state, isAuthenticated]) =>
        (isLoaded(state) || isError(state)) && isAuthenticated
    ),
    RX.map(([state]) => (isLoaded(state) ? (state as Loaded).data : undefined))
  );
}

function synchronizeCollectionRecord<
  Data extends { _id: string; updatedAt: Date }
>({
  collectionName,
  $localStore,
  updateLocalState,
  adapter,
}: {
  collectionName: CollectionName;
  $localStore: RX.Observable<Record<string, Data>>;
  updateLocalState: (
    mergeFn: (currentLocalData: Record<string, Data>) => Record<string, Data>
  ) => void;
  adapter: {
    in: (data: unknown, key: string) => Promise<Either.Either<Error, Data>>;
    out: (data: Data) => Promise<unknown>;
  };
}) {
  const $remoteStore = getRemoteStore<Record<string, Data>>(
    collectionName,
    (data) => {
      const recordSchema = z.record(z.string(), z.unknown());
      const parsed = recordSchema.safeParse(data);

      console.log(
        `Parsed remote data for collection ${collectionName}:`,
        parsed.success ? "Success" : "Failed",
        parsed.success ? parsed.data : parsed.error
      );

      return parsed.success
        ? Promise.all(
            Object.entries(parsed.data)
              .map(log("parsed.data"))
              .map(([key, value]) => adapter.in(value, key))
          )
            .then(
              flow(
                ArrayFP.filter((result) => Either.isRight(result)),
                ArrayFP.chain(ArrayFP.fromEither),
                ArrayFP.map((data) => [data._id, data] as [string, Data]),
                RecordFP.fromEntries
              )
            )
            .catch((error) => {
              console.error(
                `Error processing remote data for collection ${collectionName}:`,
                error
              );
              throw error;
            })
        : Promise.reject(
            new Error(
              `Failed to parse remote data for collection ${collectionName}: ${parsed.error}`
            )
          );
    }
  );

  synchronize({
    collectionName,
    local: $localStore.pipe(
      RX.connect(identity),
      RX.distinctUntilChanged(
        (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
      )
    ),
    // RX.Observable<Record<string, Data>>
    remote: $remoteStore.pipe(
      RX.map((data) => (data == null ? ({} as Record<string, Data>) : data))
    ),
    saveLocal: (diff) =>
      Promise.resolve().then(() =>
        updateLocalState(() => mergeDataFromDiff(diff))
      ),
    saveRemote: (diff) =>
      Promise.allSettled([
        // Update remote state
        // Create and Update
        ...Object.values({ ...diff.created, ...diff.updated }).map((data) =>
          save({
            collectionName,
            data,
            transform: adapter.out,
          }).catch((error) => {
            console.error(
              `Failed to save data to collection ${collectionName}:`,
              error
            );
          })
        ),
        // Delete
        ...Object.values(diff.deleted).map((data) =>
          deleteData(collectionName, data._id)
        ),
      ]).then(constVoid),
  });
}

function synchronizeUserAccount({
  userId,
  updateLocalState,
  $localStore,
}: {
  userId: string;
  updateLocalState: (
    mergeFn: (currentLocalData: Account | null) => Account | null
  ) => void;
  $localStore: RX.Observable<Account | null>;
}) {
  const userCollectionPath = `${COLLECTIONS.USERS}/${userId}`;
  const userRef = ref(db, userCollectionPath);

  // Listen to remote changes for this specific user
  listenToRemoteCollection(
    userRef,
    (data) => {
      if (data == null) {
        return Promise.resolve(null);
      }

      const parsed = z.string().safeParse(data);
      return parsed.success
        ? decrypt(
            parsed.data,
            localStorage.getItem(LOCAL_STORAGE_KEY) ?? ""
          )
            .then(fromFirebaseData(accountSchema))
            .then(
              Either.fold(
                (error) => {
                  console.error(`Error parsing account data:`, error);
                  return null;
                },
                (accountData) => accountData
              )
            )
        : Promise.reject(new Error("Failed to decrypt user data"));
    },
    (result) => {
      pipe(
        result,
        Either.fold(
          (error) => {
            console.error(`Error syncing user ${userId}:`, error);
          },
          (accountData: Account | null) => {
            if (accountData) {
              updateLocalState(() => accountData);
            }
          }
        )
      );
    }
  );

  // Listen to local changes and sync to remote
  let lastSavedData: Account | null = null;
  
  $localStore
    .pipe(
      RX.filter((accountData): accountData is Account => accountData != null),
      RX.distinctUntilChanged(
        (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
      )
    )
    .subscribe((accountData) => {
      if (accountData && accountData._id) {
        // Only save if data has changed from last saved version
        if (lastSavedData == null || JSON.stringify(accountData) !== JSON.stringify(lastSavedData)) {
          Promise.resolve(accountData)
            .then(toFirebaseData)
            .then((data) =>
              encrypt(data, localStorage.getItem(LOCAL_STORAGE_KEY) ?? "")
            )
            .then((encryptedData) => set(userRef, encryptedData))
            .then(() => {
              lastSavedData = { ...accountData };
              console.log(`User ${userId} data saved to remote`);
            })
            .catch((error) => {
              console.error(`Failed to sync user ${userId} to remote:`, error);
            });
        }
      }
    });
}

export function synchronizeFirebase({
  $store: $localStore,
  update: updateLocalState,
  get: getLocalState,
}: {
  $store: RX.Observable<State>;
  update: <P extends Path<State>>(
    path: P
  ) => (
    map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>
  ) => void;
  get: <P extends Path<State>>(path: P) => ValueFromPath<P, State>;
}) {
  // Synchronize events collection
  synchronizeCollectionRecord({
    collectionName: COLLECTIONS.EVENTS,
    updateLocalState: updateLocalState("events"),
    $localStore: $localStore.pipe(RX.map(({ events }) => events)),
    adapter: {
      in: (d, id) => {
        const schema = z.object({
          data: z.string(),
          users: z.record(z.string(), z.boolean()),
        });
        const parsed = schema.safeParse(d);

        return parsed.success
          ? Promise.resolve(parsed.data.data)
              .then((data) =>
                decrypt(data, getLocalState(`account.events.${id}.key`))
              )
              .then((a) => {
                console.log("Decrypted event data:", a);
                return a;
              })
              .then(fromFirebaseData(eventSchema))
          : Promise.resolve(
              Either.left(
                new Error(`Failed to parse event data: ${parsed.error}`)
              )
            );
      },
      out: (data) => {
        return Promise.resolve(data)
          .then(toFirebaseData)
          .then((d) =>
            encrypt(d, getLocalState(`account.events.${data._id}.key`))
          )
          .then((serializedData) => ({
            data: serializedData,
            users: Object.fromEntries(
              Object.keys(data.participants).map((key) => [key, true])
            ),
          }));
      },
    },
  });

  // Synchronize user account data
  $isAuthenticated
    .pipe(
      RX.filter((state) => state.type === "authenticated"),
      RX.map((state) => (state as AuthenticatedState).participantId)
    )
    .subscribe((userId) => {
      synchronizeUserAccount({
        userId,
        updateLocalState: updateLocalState("account"),
        $localStore: $localStore.pipe(RX.map(({ account }) => account)),
      });
    });
}
