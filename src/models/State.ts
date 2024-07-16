import { ValueOf } from "../ValueOf.d";
import * as Registerable from "./Registerable";
import { Category } from "./Category";
import { User } from "./User";
import { Expense } from "./Expense";

const TAG = "State";

export const INITIALIZATION_STEPS = {
  INIT_USERS: "INIT_USERS",
  INIT_CATEGORIES: "INIT_CATEGORIES",
  INITITIALIZED: "INITIALIZED",
} as const;

export type InitializationSteps = ValueOf<typeof INITIALIZATION_STEPS>;

export type Creance = {
  name: string;
  categories: Registerable.Registered<Category>[];
  users: Registerable.Registered<User>[];
  expenses: Registerable.Registered<Expense>[];
  initialization: InitializationSteps;
  endDate?: Date;
};

export type State = {
  _tag: typeof TAG;
  settings: {
    currency: "€";
  };
  creances: Registerable.Registered<Creance>[];
};

export const isState = (s: unknown): s is State =>
  s != null && typeof s === "object" && s && "_tag" in s && s._tag === TAG;

const colors = [
  "#E85656",
  "#E87856",
  "#E8A856",
  "#A7C15D",
  "#36793a",
  "#63becc",
  "#355e9b",
  "#8c5ec4",
  "#e07fe3",
  "#e37f88",
];

const defaultCategories: Registerable.Registered<Category>[] = (
  [
    {
      icon: "CART",
      name: "Courses",
    },
    {
      icon: "CAMERA",
      name: "Visite",
    },
    {
      icon: "DINNER",
      name: "Restaurant",
    },
    {
      icon: "BILL",
      name: "Échange",
    },
  ] as const
).map(({ icon, name }, index) =>
  Registerable.register<Category>(
    Registerable.unregisted<Category>({
      icon,
      name,
      color: colors[(colors.length - 1) % index],
    })
  )
);

export const defaultCreance: Registerable.Unregistered<Creance> =
  Registerable.unregisted({
    name: "",
    categories: defaultCategories,
    users: [],
    expenses: [],
    initialization: INITIALIZATION_STEPS.INIT_USERS,
  });

export const defaultState: State = {
  _tag: TAG,
  settings: {
    currency: "€",
  },
  creances: [],
};
