import { IconName } from "./../shared/library/icon/icon";
import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import * as CreanceService from "../services/CreanceService";
import { Category } from "../models/Category";
import { Creance } from "../models/State";
import * as Registerable from "../models/Registerable";

export const of = (category: {
  id?: string;
  name: string;
  icon: IconName;
  color: string;
}): Registerable.Registerable<Category> => Registerable.of(category);

export const add =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (category: Registerable.Unregistered<Category>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        categories: [...creance.categories, Registerable.register(category)],
      })),
      Either.map(CreanceService.update)
    );

export const update =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (category: Registerable.Registered<Category>) =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => ({
        ...creance,
        categories: creance.categories.map((cat) =>
          Registerable.equals(cat, category) ? category : cat
        ),
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
        categories: creance.categories.filter((category) => category.id !== id),
      })),
      Either.map(CreanceService.update)
    );

export const get =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  (id: string): Either.Either<Error, Registerable.Registered<Category>> =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) =>
        creance.categories.find((category) => category.id === id)
      ),
      Either.chain(
        Either.fromNullable(`Category with id ${id} has not been found`)
      ),
      Either.mapLeft((e) => new Error(e))
    );

export const getAll =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable(`Creance ${creanceId} is not defined`),
      Either.chain(CreanceService.get),
      Either.map((creance) => creance.categories)
    );

export const count =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      getAll(creanceId)(),
      Either.map((categories) => categories.length)
    );

export const isEmpty =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      count(creanceId)(),
      Either.map((length) => length === 0)
    );
