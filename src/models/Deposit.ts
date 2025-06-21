import { User } from "./User";

export type Deposit = {
  _id: string;
  amount: string;
  from: User["_id"];
  to: User["_id"];
  note: string;
  updatedAt: Date;
  date: Date;
};
