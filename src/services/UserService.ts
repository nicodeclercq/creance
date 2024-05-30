import { Either, fromNullable } from "fp-ts/es6/Either";

import { Creance } from "../models/State";
import { User } from "../models/User";
import * as Registerable from "../models/Registerable";

export const of = (user: {
  id?: string;
  name: string;
  avatar: string;
  color: string;
  defaultDistribution: number;
}): Registerable.Registerable<User> => Registerable.of(user);

export const add =
  (state: Creance) =>
  (user: Registerable.Unregistered<User>): Creance => ({
    ...state,
    users: [...state.users, Registerable.register(user)],
  });

export const update =
  (state: Creance) =>
  (user: Registerable.Registered<User>): Creance => ({
    ...state,
    users: Registerable.isRegistered(user)
      ? state.users.map((usr) => (Registerable.equals(usr, user) ? user : usr))
      : state.users,
  });

export const remove =
  (state: Creance) =>
  (id: string): Creance => ({
    ...state,
    users: state.users.filter((user) => user.id !== id),
  });

export const get =
  (state: Creance) =>
  (id: string): Either<Error, Registerable.Registered<User>> =>
    fromNullable(new Error(`User with id ${id} has not been found`))(
      state.users.find((user) => user.id === id)
    );

export const getAll = (state: Creance) => () => state.users;

export const isEmpty = (state: Creance) => () => state.users.length === 0;
