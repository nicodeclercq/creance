import { IconName } from "./../shared/library/icon/icon";
import { Either, fromNullable } from "fp-ts/es6/Either";

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
  (state: Registerable.Registered<Creance>) =>
  (
    category: Registerable.Unregistered<Category>
  ): Registerable.Registered<Creance> => ({
    ...state,
    categories: [...state.categories, Registerable.register(category)],
  });

export const update =
  (state: Registerable.Registered<Creance>) =>
  (category: Registerable.Registered<Category>): Creance => ({
    ...state,
    categories: state.categories.map((cat) =>
      Registerable.equals(cat, category) ? category : cat
    ),
  });

export const remove =
  (state: Registerable.Registered<Creance>) =>
  (id: string): Registerable.Registered<Creance> => ({
    ...state,
    categories: state.categories.filter((category) => category.id !== id),
  });

export const get =
  (state: Registerable.Registered<Creance>) =>
  (id: string): Either<Error, Registerable.Registered<Category>> =>
    fromNullable(new Error(`Category with id ${id} has not been found`))(
      state.categories.find((category) => category.id === id)
    );

export const getAll = (state: Registerable.Registered<Creance>) => () =>
  state.categories;

export const isEmpty = (state: Registerable.Registered<Creance>) => () =>
  state.categories.length === 0;
