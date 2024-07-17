import { BehaviorSubject, timer, map } from "rxjs";
import { FunctionN, pipe } from "fp-ts/function";
import { State, defaultState } from "./../models/State";
import * as LocalStorageService from "./LocalStorageService";
import * as SupabaseService from "./SupabaseService";
import * as CreanceService from "./CreanceService";

type Reducer<S, T> = (s: S) => (t: T) => S;

type Runtime = {
  isLoading: boolean;
  isOnline: boolean;
};

export const Store = new BehaviorSubject(defaultState);
export const Runtime = new BehaviorSubject<Runtime>({
  isLoading: true,
  isOnline: navigator.onLine,
});

export const get = Store.asObservable;
export const update = (newState: State | FunctionN<[State], State>) =>
  Store.next(typeof newState === "function" ? newState(Store.value) : newState);
export const save =
  <T>(reducer: Reducer<State, T>) =>
  (entity: T) =>
    pipe(Store.value, (state) => reducer(state)(entity), update);

function syncLocalAndRemoteStates() {
  LocalStorageService.getState()
    .then((state) =>
      SupabaseService.getAllCreances().then((creances) => {
        CreanceService.mergeCreanceLists({
          local: state.creances,
          remote: creances,
        });
      })
    )
    .then(() => Runtime.next({ ...Runtime.value, isLoading: false }));
}

function syncRuntimeData() {
  return timer(1000)
    .pipe(map(() => navigator.onLine))
    .subscribe((isOnline) => Runtime.next({ ...Runtime.value, isOnline }));
}

function setup() {
  syncLocalAndRemoteStates();
  syncRuntimeData();
  LocalStorageService.connect(Store.asObservable());
}
setup();
