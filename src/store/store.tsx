import {
  type ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { BehaviorSubject } from "rxjs";
import * as RX from "rxjs";

export type Path<T, Prefix extends string = ""> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${Prefix}${
        | `${K}`
        | (`${K}` extends `${number}` ? `[${K}]` : never)}${
        | ""
        | Path<T[K], ".">}`;
    }[(string | number) & keyof T]
  : never;

export type ValueFromPath<P, O> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof O
    ? ValueFromPath<Tail, O[Head]>
    : never
  : P extends keyof O
  ? O[P]
  : never;

const getValueFromPath =
  <P extends Path<O>, O>(path: P) =>
  (object: O): ValueFromPath<P, O> => {
    if (!path) {
      return object as ValueFromPath<P, O>;
    }
    if (typeof path !== "string") {
      throw new Error("Path must be a string");
    }

    return path.split(".").reduce((acc, key) => {
      return acc[key as keyof typeof acc];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, object as any) as ValueFromPath<P, O>;
  };

function setValueAtPath<P extends Path<S>, S>(
  path: P,
  map: (oldValue: ValueFromPath<P, S>) => ValueFromPath<P, S>,
  state: S
): S {
  // automatically add updatedAt date to the value
  const mapWithUpdatedAtDate = (
    oldValue: ValueFromPath<P, S>
  ): ValueFromPath<P, S> => {
    const newValue = map(oldValue);
    if (
      typeof newValue === "object" &&
      newValue !== null &&
      "updatedAt" in newValue
    ) {
      return {
        ...newValue,
        updatedAt: new Date(),
      };
    }
    return newValue;
  };

  if (path.length === 0) {
    return mapWithUpdatedAtDate(state as ValueFromPath<P, S>) as S;
  }

  const [h, ...t] = path.split(".");
  const head = h as keyof S;
  const tail = t.join(".") as Path<S[keyof S]>;

  const newState = (state instanceof Array ? [...state] : { ...state }) as S;
  // @ts-expect-error FIXME
  newState[head] = setValueAtPath(tail, map, newState[head]) as S;
  return newState;
}

export function createContextStore<State>(initialState: State) {
  const store = new BehaviorSubject<State>(initialState);
  const StoreContext = createContext(store);

  function StoreProvider({ children }: { children: ReactNode }) {
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  }

  function useStore<P extends Path<State>>(path: P) {
    const store = useContext(StoreContext);
    const [state, setState] = useState(
      getValueFromPath<P, State>(path)(store.getValue())
    );

    useEffect(() => {
      const subscription = store
        .pipe(RX.map(getValueFromPath(path)), RX.distinctUntilChanged())
        .subscribe({
          next: setState,
        });

      return () => subscription.unsubscribe();
    }, [store, path]);

    const change = (
      map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>
    ) => {
      store.next(setValueAtPath(path, map, store.getValue()));
    };

    return [state, change] as const;
  }

  function onChange(callback: (state: State) => void) {
    const subscription = store.asObservable().subscribe({
      next: (value) => {
        callback(value);
      },
    });

    return () => subscription.unsubscribe();
  }

  function onPathChange<P extends Path<State>>(
    path: P,
    callback: (newValue: ValueFromPath<P, State>) => void
  ) {
    const subscription = RX.connectable(store)
      .pipe(RX.map(getValueFromPath(path)), RX.distinctUntilChanged())
      .subscribe({
        next: (value) => {
          callback(value);
        },
      });

    return () => subscription.unsubscribe();
  }

  function load(state: State | ((currentState: State) => State)) {
    if (typeof state === "function") {
      store.next((state as (currentState: State) => State)(store.getValue()));
    } else {
      store.next(state);
    }
  }

  const update =
    <P extends Path<State>>(path: P) =>
    (map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>) => {
      load((currentState) => setValueAtPath(path, map, currentState as State));
    };

  const get = <P extends Path<State>>(path: P) => {
    return getValueFromPath<P, State>(path)(store.getValue());
  };

  return {
    StoreProvider,
    useStore,
    onChange,
    onPathChange,
    load,
    get,
    update,
    $store: store.asObservable(),
  } as const;
}
