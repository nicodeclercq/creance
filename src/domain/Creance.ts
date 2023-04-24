import { Expense } from "./Expense";
import { User } from "./auth/User";
import { v4 as uid } from "uuid";

export type Creance = {
  id: string;
  name: string;
  users: User[];
  startDate?: Date;
  endDate?: Date;
  userGroup?: Record<
    User["uid"],
    {
      adult: number;
      child: number;
    }
  >;
  userPresence?: Record<User["uid"], { [d in string]: boolean }>;
  defaultDistribution: Record<User["uid"], number>;
  expenses: Expense[];
};

export type DraftCreance = Omit<Creance, "id" | "expenses">;

export const createDraftCreance = (
  init: Partial<DraftCreance> & { name: string }
): DraftCreance => {
  const defaultValues: DraftCreance = {
    name: "",
    users: [],
    startDate: new Date(),
    defaultDistribution: {},
  };

  return {
    ...defaultValues,
    ...init,
  };
};

export const toCreance = (draft: DraftCreance): Creance => ({
  ...draft,
  id: uid(),
  expenses: [],
});

export const isCreance = (
  creance: Creance | DraftCreance
): creance is Creance => "id" in creance;

export const isDraftCreance = (
  creance: Creance | DraftCreance
): creance is DraftCreance => !("id" in creance);
