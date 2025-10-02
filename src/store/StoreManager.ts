import { Fn, runSequentially } from "../helpers/function";

import { BehaviorSubject } from "rxjs";
import { Logger } from "../service/Logger";
import { State } from "./state";
import { isDefined } from "@mui/x-charts/internals";

export type StoreLoading = {
  type: "loading";
};

export type StoreReady<A> = {
  type: "ready";
  data: A;
};

export type StoreAuthenticated<A> = {
  type: "authenticated";
  data: A;
};

export type StoreErrored = {
  type: "error";
  error: string;
};

export type Store<A> =
  | StoreLoading
  | StoreReady<A>
  | StoreAuthenticated<A>
  | StoreErrored;

type MaybePromise<A> = A | Promise<A>;

export type FirstStoreAdapter<A = State> = {
  initializer: () => MaybePromise<A>;
  onStateChange?: (state: Store<A>) => void;
  onInitFailure?: Fn<[{ error: Error; retry: () => void }], void>;
  cron?: {
    periodicity: number;
    run: Fn<[Fn<[Store<A>], void>], MaybePromise<void>>;
  };
};
export type StoreAdapter<A = State> = {
  initializer: (
    state: A,
    updateStore: (map: Fn<[Store<A>], Store<A>>) => void
  ) => MaybePromise<A>;
  onStateChange?: (state: Store<A>) => void;
  onInitFailure?: Fn<[{ error: Error; retry: () => void }], void>;
  cron?: {
    periodicity: number;
    run: Fn<[Fn<[Store<A>], void>], MaybePromise<void>>;
  };
};

const runCrons = <A>(
  setState: (data: Store<A>) => void,
  crons: {
    periodicity: number;
    run: Fn<[Fn<[Store<A>], void>], MaybePromise<void>>;
  }[]
) =>
  crons
    .map((cron) => setInterval(() => cron.run(setState), cron.periodicity))
    .reduce(
      (acc, interval) => () => {
        acc();
        clearInterval(interval);
      },
      (() => {}) as Fn<[], void>
    );

const storeManager = <A = State>() => {
  const $store = new BehaviorSubject<Store<A>>({
    type: "loading",
  });
  let adapters: StoreAdapter<A>[] = [];
  let stopCrons = () => {};

  const update = (newState: Store<A> | Fn<[Store<A>], Store<A>>) => {
    const state =
      typeof newState === "function" ? newState($store.getValue()) : newState;
    $store.next(state);
    adapters.forEach((adapter) => adapter.onStateChange?.(state));
  };

  const launch = ({
    adapters: adaptersToLaunch,
  }: {
    adapters: [FirstStoreAdapter<A>, ...StoreAdapter<A>[]];
  }) => {
    adapters = adaptersToLaunch;
    const init = () => {
      const [first, ...rest] = adapters.map(
        (adapter) => adapter.initializer
      ) as [
        FirstStoreAdapter<A>["initializer"],
        ...StoreAdapter<A>["initializer"][]
      ];

      Promise.resolve()
        .then(first)
        .then((newData) =>
          runSequentially(
            newData,
            rest.map(
              (adapter) => (state: A) =>
                adapter(state, (map: Fn<[Store<A>], Store<A>>) =>
                  update(map($store.getValue()))
                )
            )
          ).then((newData) => {
            update({
              type: "ready",
              data: newData,
            });
          })
        )
        .catch((error: Error) => {
          Logger.error("Failed to initialize state manager")(error);
          update({
            type: "error",
            error: "Failed to initialize state manager",
          });
          adapters.forEach((adapter) =>
            adapter.onInitFailure?.({
              error,
              retry: init,
            })
          );
        });
    };

    const rerunCrons = () => {
      const crons = adapters.map((adapter) => adapter.cron).filter(isDefined);
      stopCrons();
      stopCrons = runCrons(update, crons);
    };

    // Start the process
    init();
    rerunCrons();

    return {
      initialState: $store.getValue(),
      stopCrons,
      rerunCrons,
      changeState: update,
    };
  };

  const ready = (state: A): Store<A> => ({
    type: "ready",
    data: state,
  });

  const authenticated = (state: A): Store<A> => ({
    type: "authenticated",
    data: state,
  });

  const loading = (): Store<A> => ({
    type: "loading",
  });

  const errored = (error: Error): Store<A> => ({
    type: "error",
    error: error.message,
  });

  const isLoading = (state: Store<A>): state is StoreLoading =>
    state.type === "loading";
  const isReady = (state: Store<A>): state is StoreReady<A> =>
    state.type === "ready";
  const isAuthenticated = (state: Store<A>): state is StoreAuthenticated<A> =>
    state.type === "authenticated";
  const isError = (state: Store<A>): state is StoreErrored =>
    state.type === "error";

  const hasData = (
    state: Store<A>
  ): state is StoreReady<A> | StoreAuthenticated<A> =>
    isReady(state) || isAuthenticated(state);

  return {
    $store,
    launch,
    loading,
    ready,
    errored,
    authenticated,
    update,
    isLoading,
    isReady,
    isAuthenticated,
    isError,
    hasData,
  };
};

export const StoreManager = storeManager();
