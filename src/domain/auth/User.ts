import * as Option from "fp-ts/Option";

export class SignedInUser {
  constructor(public readonly uid: string) {}
}
export const signedInUser = ({ uid }: { uid: string }) => new SignedInUser(uid);

export class PartialUser {
  constructor(
    public readonly displayName: Option.Option<string>,
    public readonly email: Option.Option<string>,
    public readonly photoURL: Option.Option<string>,
    public readonly uid: string
  ) {}
}
export const partialUser = ({
  displayName,
  email,
  photoURL,
  uid,
}: {
  displayName: Option.Option<string>;
  email: Option.Option<string>;
  photoURL: Option.Option<string>;
  uid: string;
}) => new PartialUser(displayName, email, photoURL, uid);

export class CompleteUser {
  constructor(
    public readonly displayName: string,
    public readonly email: string,
    public readonly photoURL: Option.Option<string>,
    public readonly uid: string
  ) {}
}
export const completeUser = ({
  displayName,
  email,
  photoURL,
  uid,
}: {
  displayName: string;
  email: string;
  photoURL: Option.Option<string>;
  uid: string;
}) => new CompleteUser(displayName, email, photoURL, uid);

export type User = CompleteUser;
export type CurrentUser = SignedInUser | PartialUser | CompleteUser;

export const isSignedInUser = (user: CurrentUser): user is SignedInUser =>
  user instanceof SignedInUser;
export const isPartialUser = (user: CurrentUser): user is PartialUser =>
  user instanceof PartialUser;
export const isCompleteUser = (user: CurrentUser): user is CompleteUser =>
  user instanceof CompleteUser;

export const fold =
  <A>({
    onSignedIn,
    onPartial,
    onComplete,
  }: {
    onSignedIn: (user: SignedInUser) => A;
    onPartial: (user: PartialUser) => A;
    onComplete: (user: CompleteUser) => A;
  }) =>
  (user: CurrentUser): A => {
    if (isSignedInUser(user)) {
      return onSignedIn(user);
    }
    if (isPartialUser(user)) {
      return onPartial(user);
    }
    if (isCompleteUser(user)) {
      return onComplete(user);
    }
    throw new Error("Unhandled user type");
  };
