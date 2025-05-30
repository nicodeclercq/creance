import { User } from "./User";

export type DefaultShare = {
  type: "default";
};
export type PercentageShare = {
  type: "percentage";
  distribution: Record<User["_id"], string>;
};

export type FixedShare = {
  type: "fixed";
  distribution: Record<User["_id"], string>;
};

export type Share = DefaultShare | PercentageShare | FixedShare;

export type Expense = {
  _id: string;
  reason: string;
  category: string;
  amount: string;
  date: Date;
  share: Share;
  lender: User["_id"];
};
