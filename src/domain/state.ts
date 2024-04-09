import { Lens } from "monocle-ts";
import { constant } from "fp-ts/function";
import * as Option from "fp-ts/Option";
import { User } from "./auth/User";
import { Creance } from "./Creance";

export type State = {
  currentUser: User["uid"];
  users: Record<User["uid"], User>;
  creanceList: Creance[];
};

export const INITIAL_STATE: State = {
  currentUser: "1",
  users: {
    1: {
      displayName: "Nicolas",
      email: "nicolas.declercq@hotmail.fr",
      photoURL: Option.of(
        "https://ca.slack-edge.com/T03L75GUK-U046QDTBJ6L-c19521bbb11d-512"
      ),
      uid: "1",
    },
  },
  creanceList: [],
};

export type Path<O extends object> = {
  [Key in keyof O & (string | number)]: O[Key] extends object
    ? `${Key}` | `${Key}.${Path<O[Key]>}`
    : `${Key}`;
}[keyof O & (string | number)];

export type ValueAt<P extends string, S> = P extends keyof S
  ? S[P]
  : P extends `${infer First}.${infer Rest}`
  ? First extends keyof S
    ? ValueAt<Rest, S[First]>
    : never
  : never;

/**
 * Creates a new State object with the value at the given path modified
 */
export const update =
  <P extends Path<State>>(path: P, value: ValueAt<P, State>) =>
  (state: State): State => {
    const lens = Lens.fromPath<State>();
    const nodes = `${path}`.split(".") as Parameters<typeof lens>[0];

    return lens(nodes).modify(constant(value))(state);
  };

/**
 * Get the value at a given path from State
 */
export const read =
  <P extends Path<State>>(path: P) =>
  (state: State): ValueAt<P, State> => {
    const lens = Lens.fromPath<State>();
    const nodes = `${path}`.split(".") as Parameters<typeof lens>[0];

    return lens(nodes).get(state) as ValueAt<P, State>;
  };
