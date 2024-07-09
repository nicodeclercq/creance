import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";

import { Creance } from "../models/State";
import { User } from "../models/User";
import * as Registerable from "../models/Registerable";
import * as CreanceService from "../services/CreanceService";

export const of = (user: {
  id?: string;
  name: string;
  avatar: string;
  color: string;
  defaultDistribution: number;
}): Registerable.Registerable<User> => Registerable.of(user);

export const add =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (user: Registerable.Unregistered<User>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        users: [...creance.users, Registerable.register(user)],
      })),
      Either.map(CreanceService.update)
    );

export const update =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (user: Registerable.Registered<User>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        users: Registerable.isRegistered(user)
          ? creance.users.map((usr) =>
              Registerable.equals(usr, user) ? user : usr
            )
          : creance.users,
      })),
      Either.map(CreanceService.update)
    );

export const remove =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (id: string) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        users: creance.users.filter((user) => user.id !== id),
      })),
      Either.map(CreanceService.update)
    );

export const get =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (id: string): Either.Either<Error, Registerable.Registered<User>> =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => creance.users),
      Either.map((users) => users.find((user) => user.id === id)),
      Either.chain(
        Either.fromNullable(`User with id ${id} has not been found`)
      ),
      Either.mapLeft((e) => new Error(e))
    );

export const getAll =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => creance.users)
    );

export const count =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      getAll(creanceId)(),
      Either.map((users) => users.length)
    );

export const isEmpty =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      count(creanceId)(),
      Either.map((length) => length === 0)
    );
