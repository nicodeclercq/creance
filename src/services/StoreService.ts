import { BehaviorSubject } from "rxjs";
import { FunctionN, pipe } from "fp-ts/function";
import { State, defaultState } from "./../models/State";

type Reducer<S, T> = (s: S) => (t: T) => S;

export const Store = new BehaviorSubject(defaultState);

export const get = Store.asObservable;
export const update = (newState: State | FunctionN<[State], State>) =>
  Store.next(typeof newState === "function" ? newState(Store.value) : newState);
export const save =
  <T>(reducer: Reducer<State, T>) =>
  (entity: T) =>
    pipe(Store.value, (state) => reducer(state)(entity), update);
