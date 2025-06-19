import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import { identity, constVoid } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import * as RecordFP from "fp-ts/Record";
import * as RX from "rxjs";
import * as z from "zod";

import {
  DataSnapshot,
  getDatabase,
  onValue,
  get,
  ref,
  set,
  forceLongPolling,
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
import { eventSchema, expenseSchema, userSchema } from "../adapters/json";
import { State } from "../store/state";
import { Path, ValueFromPath } from "../store/store";
import { synchronize } from "./synchronize";
import { log } from "../ui/Debug/Debug";

type Schema<Data> = ZodSchema<Data, any, any>;

export const COLLECTIONS = {
  EVENTS: "events",
  EXPENSES: "expenses",
  USERS: "users",
} as const;
type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
forceLongPolling();

type LoadtingState = {
  type: "loading";
};
type AuthenticatedState = {
  type: "authenticated";
  userId: string;
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
  log("firebase", "Auth state changed:", user);
  if (user === null) {
    $isAuthenticated.next({ type: "unauthenticated" });
  } else if (user.uid) {
    $isAuthenticated.next({ type: "authenticated", userId: user.uid });
  }
});

export const getData = <Data>(
  collectionName: CollectionName,
  adapter: (data: unknown) => Data = identity as (data: unknown) => Data
): TaskEither.TaskEither<Error, Record<string, Data>> => {
  return () =>
    new Promise((resolve, reject) => {
      const collectionRef = ref(db, collectionName);
      get(collectionRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const firebaseSchema = z.record(z.string(), z.unknown());
            const result = firebaseSchema.safeParse(data);

            if (result.success) {
              const adaptedData = RecordFP.map(adapter)(result.data);
              resolve(Either.right(adaptedData));
            } else {
              reject(new Error(result.error.message));
            }
          } else {
            resolve(Either.right({}));
          }
        })
        .catch((error) => {
          console.error(
            `Failed to get data from collection ${collectionName}:`,
            error
          );
          reject(
            new Error(`Failed to get data from collection ${collectionName}`)
          );
        });
    });
};

const listenToRemoteChanges = <LocalData>(
  collectionName: CollectionName,
  adapter: (d: unknown) => LocalData = identity as (d: unknown) => LocalData,
  onChange: (data: Either.Either<Error, Record<string, LocalData>>) => void
) => {
  const collectionRef = ref(db, collectionName);
  const firebaseWatch = (): RX.Observable<
    Either.Either<Error, Record<string, LocalData>>
  > => {
    const $value = new RX.Subject<
      Either.Either<Error, Record<string, LocalData>>
    >();
    log(
      "firebase",
      `Listening to changes in Firebase for collection ${collectionName}`
    );

    try {
      onValue(
        collectionRef,
        (snapshot) =>
          pipe(
            snapshot,
            (a) => {
              log(
                "firebase",
                `Data received from Firebase for collection ${collectionName}:`,
                a
              );
              return a;
            },
            Either.fromPredicate(
              (s: DataSnapshot) => s.exists(),
              () =>
                new Error(
                  `No data found in Firebase for collection ${collectionName}`
                )
            ),
            Either.chain((s) => {
              const firebaseSchema = z.record(z.string(), z.unknown());
              const result = firebaseSchema.safeParse(s.val());

              return result.success
                ? pipe(result.data, RecordFP.map(adapter), Either.right)
                : Either.left(new Error(result.error.message));
            }),
            (value) => $value.next(value)
          ),
        (error: Error) => {
          log("Error", collectionName, error);
          $value.next(
            Either.left(
              new Error(
                `Error listening to changes in Firebase for collection ${collectionName}:`
              )
            )
          );
        }
      );
    } catch (error) {
      log(
        "firebase",
        `Error setting up listener for collection ${collectionName}:`,
        error
      );
    }
    return $value;
  };

  firebaseWatch().subscribe({
    next: (data) => {
      onChange(data);
    },
    error: (error) => {
      log("firebase", `Error in collection ${collectionName}:`, error);
    },
  });
};

const toFirebaseData = <Data>(data: Data): string => JSON.stringify(data);

const fromFirebaseData =
  <Data>(schema: Schema<Data>) =>
  (data: unknown): Either.Either<Error, Data> => {
    try {
      const parsed = z.string().safeParse(data);
      if (parsed.success) {
        const d = JSON.parse(parsed.data);
        const dd = typeof d === "string" ? JSON.parse(d) : d;
        const result = schema.safeParse(dd);
        return result.success
          ? Either.right(result.data)
          : Either.left(result.error);
      } else {
        return Either.left(new Error(`Failed to parse data: ${parsed.error}`));
      }
    } catch (error) {
      console.error("Failed to parse Firebase data:", data);
      return Either.left(new Error(`Failed to parse Firebase data: ${error}`));
    }
  };

export function signUpUser({
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
          new Error(`Failed to create user: ${errorCode} - ${errorMessage}`)
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
      .then(() => Either.right(undefined))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return Either.left(
          new Error(`Failed to create user: ${errorCode} - ${errorMessage}`)
        );
      });
}

export function logoutUser() {
  auth.signOut().then(() => {
    Object.values(COLLECTIONS).forEach((collectionName) => {
      localStorage.getItem(`lastUpdate_${collectionName}`);
    });
  });
}

function save<Data extends { _id: string }>({
  collectionName,
  transform = toFirebaseData,
  data,
}: {
  collectionName: CollectionName;
  transform?: (data: Data) => unknown;
  data: Data;
}): Promise<void> {
  return Promise.resolve()
    .then(() => auth.authStateReady())
    .then(() => ref(db, `${collectionName}/${data._id}`))
    .then((collectionRef) => set(collectionRef, transform(data)));
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
  adapter: (data: unknown) => Data = identity as (data: unknown) => Data
) {
  type Loading = { type: "loading" };
  type Loaded = { type: "loaded"; data: Record<string, Data> };
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
          log("firebase", `Error in collection ${collectionName}:`, error);
          $remoteStore.next({ type: "errored" });
        },
        (newRemoteData: Record<string, Data>) => {
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
    RX.map(([state]) => (isLoaded(state) ? (state as Loaded).data : {})),
    RX.tap((state) => log("firebase", "Remote changed:", state))
  );
}

function synchronizeCollection<Data extends { _id: string; updatedAt: Date }>({
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
    in: (data: unknown) => Either.Either<Error, Data>;
    out: (data: Data) => unknown;
  };
}) {
  const $remoteStore = getRemoteStore(collectionName, adapter.in);

  synchronize({
    collectionName,
    local: $localStore.pipe(
      RX.connect(identity),
      RX.distinctUntilChanged(
        (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
      )
    ),
    remote: $remoteStore.pipe(
      RX.map(
        RecordFP.filterMap((data) =>
          Option.fromNullable(Either.isRight(data) ? data.right : undefined)
        )
      )
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

export function synchronizeFirebase({
  $store: $localStore,
  update: updateLocalState,
}: {
  $store: RX.Observable<State>;
  update: <P extends Path<State>>(
    path: P
  ) => (
    map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>
  ) => void;
}) {
  synchronizeCollection({
    collectionName: COLLECTIONS.EVENTS,
    updateLocalState: updateLocalState("events"),
    $localStore: $localStore.pipe(RX.map(({ events }) => events)),
    adapter: {
      in: (d) => {
        const schema = z.object({
          data: z.string(),
          participants: z.array(z.string()),
        });
        const parsed = schema.safeParse(d);

        if (!parsed.success) {
          return Either.left(
            new Error(`Failed to parse event data: ${parsed.error}`)
          );
        }

        return fromFirebaseData(eventSchema)(parsed.data.data);
      },
      out: (data) => ({
        data: toFirebaseData(data),
        participants: data.participants,
      }),
    },
  });

  synchronizeCollection({
    collectionName: COLLECTIONS.USERS,
    updateLocalState: updateLocalState("users"),
    $localStore: $localStore.pipe(RX.map(({ users }) => users)),
    adapter: {
      in: fromFirebaseData(userSchema),
      out: toFirebaseData,
    },
  });

  synchronizeCollection({
    collectionName: COLLECTIONS.EXPENSES,
    updateLocalState: updateLocalState("expenses"),
    $localStore: $localStore.pipe(RX.map(({ expenses }) => expenses)),
    adapter: {
      in: fromFirebaseData(expenseSchema),
      out: toFirebaseData,
    },
  });
}
