import { notEmpty } from "../infrastructure/string";
import { Expense } from "./Expense";
import { User } from "./auth/User";
import { v4 as uid } from "uuid";

export type Creance = {
  id: string;
  name: string;
  participants: {
    user: User;
    defaultDistribution: {
      adult: number;
      child: number;
    };
  }[];
  startDate?: Date;
  endDate?: Date;
  expenses: Expense[];
};

export type DraftCreance = Omit<Creance, "id" | "expenses">;

export const createDraftCreance = (
  init: Partial<DraftCreance> & { name: string }
): DraftCreance => {
  const defaultValues: DraftCreance = {
    name: "",
    participants: [],
    startDate: new Date(),
  };

  return {
    ...defaultValues,
    ...init,
  };
};

export const isReady = (draft: DraftCreance) => {
  return notEmpty(draft.name);
};

export const draftToCreance = (draft: DraftCreance): Creance => ({
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
