import { BehaviorSubject, map } from "rxjs";
import { State, defaultState } from "./../models/State";

type Reducer<S, T> = (s: S) => (t: T) => S;

export const Store = new BehaviorSubject(defaultState);

export const get = () => Store.asObservable();
export const update = (state: State) => Store.next(state);
export const save =
  <T>(reducer: Reducer<State, T>) =>
  (entity: T) =>
    get().pipe(map((state) => reducer(state)(entity)));
