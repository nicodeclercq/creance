import { Participant } from "./Participant";

export type Deposit = {
  _id: string;
  amount: string;
  from: Participant["_id"];
  to: Participant["_id"];
  note: string;
  updatedAt: Date;
  date: Date;
};
