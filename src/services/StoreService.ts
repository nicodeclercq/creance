import { BehaviorSubject } from "rxjs";
import { FunctionN, pipe } from "fp-ts/function";
import { State, defaultState } from "./../models/State";
import * as LocalStorageService from "./LocalStorageService";
import * as SupabaseService from "./SupabaseService";
import * as CreanceService from "./CreanceService";

type Reducer<S, T> = (s: S) => (t: T) => S;

type Runtime = {
  isLoading: boolean;
};

export const Store = new BehaviorSubject(defaultState);
export const Runtime = new BehaviorSubject<Runtime>({ isLoading: true });

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
    .then(() => Runtime.next({ isLoading: false }));
}

function setup() {
  syncLocalAndRemoteStates();
  LocalStorageService.connect(Store.asObservable());
}
setup();
