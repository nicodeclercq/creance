import { notEmpty } from "../infrastructure/string";
import { User } from "./auth/User";
import { v4 as uid } from "uuid";

export type Expense = {
  id: string;
  from: User;
  date: Date;
  amount: number;
  distribution: Record<User["uid"], number>;
  category: string;
  message: string;
};

export type DraftExpence = Omit<Expense, "id" | "date"> & {
  date?: Expense["date"];
};

export const createDraftExpense = (
  init: Partial<DraftExpence>,
  currentUser: User
) => {
  const defaultValues: DraftExpence = {
    message: "",
    category: "default",
    date: new Date(),
    from: currentUser,
    amount: 0,
    distribution: {},
  };

  return {
    ...defaultValues,
    ...init,
  };
};

export const isReady = (draft: DraftExpence) => {
  return (
    draft.amount > 0 &&
    notEmpty(draft.category) &&
    Object.keys(draft.distribution).length > 0 &&
    notEmpty(draft.message)
  );
};

export const createExpense = (draft: DraftExpence): Expense => ({
  id: uid(),
  date: new Date(),
  ...draft,
});
