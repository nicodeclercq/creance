import { User } from "./auth/User";

export type Expense = {
  from: User;
  date: Date;
  amount: number;
  distribution: Record<User["uid"], number>;
  category: string;
};
