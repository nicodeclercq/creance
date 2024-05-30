import { State, defaultState } from './State';

export type Account = {
  name: string;
  description: string;
  state: State;
}

export const defaultAccount: Account = {
  name: new Date().toLocaleDateString(),
  description: '',
  state: defaultState,
};