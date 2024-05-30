import { UID } from './../@types/uid.d';

export type Distribution = {
  [key: string]: number
};

export type Expense = {
  amount: number;
  description: string;
  category: UID;
  from: UID;
  distribution: Distribution;
};