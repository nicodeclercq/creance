import * as Firebase from "firebase/auth";
import { app } from "./firebase";

const auth = Firebase.getAuth(app);

export const onAuthStateChanged = (
  callback: (user: Firebase.User | null) => void
) => Firebase.onAuthStateChanged(auth, callback);

export const createUser = ({
  email,
  password,
  keepLoggedIn,
}: {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}) =>
  Firebase.setPersistence(
    auth,
    keepLoggedIn
      ? Firebase.browserLocalPersistence
      : Firebase.inMemoryPersistence
  ).then(() =>
    Firebase.createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => user
    )
  );

export const login = ({
  email,
  password,
  keepLoggedIn,
}: {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}) =>
  Firebase.setPersistence(
    auth,
    keepLoggedIn
      ? Firebase.browserLocalPersistence
      : Firebase.inMemoryPersistence
  ).then(() => Firebase.signInWithEmailAndPassword(auth, email, password));

export const logout = Firebase.signOut(auth);
