import * as Either from "fp-ts/Either";
import * as TaskEither from "fp-ts/TaskEither";

import { get, getDatabase, ref, set } from "firebase/database";

import { type Event } from "../models/Event";
import { User } from "../models/User";
import * as z from "zod";
import { type ZodSchema } from "zod";
import { firebaseConfig } from "../secrets";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth"; // Assuming you're using Firebase Auth
import { initializeApp } from "firebase/app";
import { pipe } from "fp-ts/function";
import { eventSchema, userSchema } from "../adapters/json";

const COLLECTIONS = {
  EVENTS: "events",
  USERS: "users",
} as const;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

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

export const listenToAuthChange = (callback: (state: AuthState) => void) => {
  callback({ type: "loading" });

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user === null) {
      return callback({ type: "unauthenticated" });
    } else if (user.uid) {
      return callback({ type: "authenticated", userId: user.uid });
    }
  });

  return () => {
    unsubscribe();
  };
};

type FirebaseEventData = {
  data: string;
  participants: Record<string, true>;
};

const toFirebaseData = <Data>(data: Data): string => JSON.stringify(data);

type FromSchema<Schema extends ZodSchema<unknown>> = Schema extends ZodSchema<
  infer Data
>
  ? Data
  : never;

const fromFirebaseData =
  <Schema extends ZodSchema<unknown>>(schema: Schema) =>
  (data: string): Either.Either<Error, FromSchema<Schema>> => {
    try {
      const d = JSON.parse(data);
      const result = schema.safeParse(d);
      return result.success
        ? Either.right(result.data as FromSchema<Schema>)
        : Either.left(result.error);
    } catch (error) {
      throw new Error(`Failed to parse Firebase data: ${error}`);
    }
  };

export function isAuthenticated(): boolean {
  return auth.currentUser?.uid !== undefined;
}

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

function getAllData<Schema extends ZodSchema<Data>, Data>(
  collectionName: string,
  schema: Schema
): TaskEither.TaskEither<Error, Record<string, Data>> {
  return () =>
    Promise.resolve()
      .then(() => {
        if (!isAuthenticated()) {
          throw new Error("User is not authenticated");
        }
      })
      .then(() => ref(db, `${collectionName}`))
      .then((collectionRef) => get(collectionRef))
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
      .then(fromFirebaseData(z.record(z.string(), schema)))
      .catch((error) =>
        Either.left(new Error(`Failed to fetch data: ${error.message}`))
      );
}

function save<Data extends { _id: string }, FirebaseData>({
  collectionName,
  transform = (data: Data) => JSON.stringify(data) as FirebaseData,
  data,
}: {
  collectionName: (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
  transform?: (data: Data) => FirebaseData;
  data: Data;
}): Promise<void> {
  return Promise.resolve()
    .then(() => {
      if (!isAuthenticated()) {
        throw new Error("User is not authenticated");
      }
    })
    .then(() => ref(db, `${collectionName}/${data._id}`))
    .then((collectionRef) =>
      set(collectionRef, pipe(data, transform, toFirebaseData))
    );
}

export function getAllEvents() {
  return getAllData(COLLECTIONS.EVENTS, eventSchema)().then((result) => {
    console.log("Fetched events:", result);
  });
}

export function saveEvent(event: Event) {
  return save({
    collectionName: COLLECTIONS.EVENTS,
    transform: (event: Event): FirebaseEventData => ({
      data: JSON.stringify(event),
      participants: {
        ...event.participants.reduce((acc, participant) => {
          acc[participant] = true;
          return acc;
        }, {} as Record<string, true>),
      },
    }),
    data: event,
  });
}

export function saveUser(user: User) {
  return save({
    collectionName: COLLECTIONS.USERS,
    data: user,
  });
}

export function getAllUsers() {
  return getAllData(COLLECTIONS.USERS, userSchema)().then((result) => {
    console.log("Fetched events:", result);
  });
}
