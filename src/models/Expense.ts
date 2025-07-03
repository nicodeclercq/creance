import { Participant } from "./Participant";

export type DefaultShare = {
  type: "default";
};
export type PercentageShare = {
  type: "percentage";
  distribution: Record<Participant["_id"], string>;
};

export type FixedShare = {
  type: "fixed";
  distribution: Record<Participant["_id"], string>;
};

export type Share = DefaultShare | PercentageShare | FixedShare;

export type Expense = {
  _id: string;
  reason: string;
  category: string;
  amount: string;
  date: Date;
  share: Share;
  lender: Participant["_id"];
  updatedAt: Date;
};
