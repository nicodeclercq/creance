import type { Deposit } from "./Deposit";
import type { Expense } from "./Expense";

export type Transaction =
  | { type: "expense"; data: Expense }
  | { type: "deposit"; data: Deposit };
