import { User } from "./User";

export type Account = User & {
  events: Record<string, { key: string; uid: string }>;
  users: Record<string, User>;
};
