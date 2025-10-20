import { Deposit } from "./Deposit";
import { Expense } from "./Expense";

export type Transaction =
  | { type: "expense"; data: Expense }
  | { type: "deposit"; data: Deposit };
