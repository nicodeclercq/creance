import * as Firebase from "firebase/auth";
import { PartialUser, partialUser } from "./User";
import * as Option from "fp-ts/Option";

export const fromFirebase = ({
  displayName,
  email,
  photoURL,
  uid,
}: Firebase.User): PartialUser =>
  partialUser({
    uid,
    displayName: Option.fromNullable(displayName),
    email: Option.fromNullable(email),
    photoURL: Option.fromNullable(photoURL),
  });
