import { FunctionN } from "fp-ts/lib/function";

export const fold =
  <Key extends string, Return>(folders: {
    [key in Key]: () => Return;
  }): FunctionN<[Key], Return> =>
  (value: Key): Return =>
    folders[value]();
