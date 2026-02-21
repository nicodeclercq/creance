import type { Adapter } from "../createStore";
import {
  DEFAULT_STATE,
  stateSchema,
  validateOrDefaultsToState,
  type State,
} from "../state";
import { merge } from "./shared/merge";
import { Logger } from "../../service/Logger";

export type LocalAdapterConfig = {
  name: string;
  read: () => Promise<string | undefined> | string | undefined;
  write: (data: string) => Promise<void> | void;
  clear: () => void;
  subscribe?: (callback: (data: string) => void) => () => void;
};

const serialize = (state: State): string => JSON.stringify(state);

const deserialize = (data: string): unknown => {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

const validate = (data: unknown): State | undefined => {
  const result = stateSchema.safeParse(data);
  return result.success ? result.data : undefined;
};

export const createLocalAdapter = (
  config: LocalAdapterConfig
): Adapter<State> => {
  const { name, read, write, clear, subscribe } = config;

  Logger.log(`LocalAdapter[${name}]: creating adapter`)({});

  const adapter: Adapter<State> = {
    load: (prev) => {
      Logger.log(`LocalAdapter[${name}]: load started`)({
        hasPrev: prev !== undefined,
      });

      return Promise.resolve()
        .then(read)
        .then((raw) => {
          Logger.log(`LocalAdapter[${name}]: read completed`)({
            hasData: raw !== undefined,
          });

          if (raw === undefined) {
            Logger.log(`LocalAdapter[${name}]: no stored data, using defaults`)(
              {}
            );
            return prev ?? DEFAULT_STATE;
          }

          const parsed = deserialize(raw);
          if (parsed === undefined) {
            Logger.error(`LocalAdapter[${name}]: failed to parse stored data`)(
              {}
            );
            return prev;
          }

          Logger.log(`LocalAdapter[${name}]: data parsed, validating`)({});

          return Promise.resolve(validateOrDefaultsToState(parsed)).then(
            (stored) => {
              const result = prev ? merge(prev, stored) : stored;
              Logger.log(`LocalAdapter[${name}]: load completed`)({
                merged: prev !== undefined,
              });
              return result;
            }
          );
        })
        .catch((error: unknown) => {
          Logger.error(`LocalAdapter[${name}]: load failed`)(error);
          return prev;
        });
    },

    onChange: (state) => {
      Logger.log(`LocalAdapter[${name}]: onChange triggered`)({});
      const serialized = serialize(state);
      Promise.resolve(serialized)
        .then(write)
        .then(() => {
          Logger.log(`LocalAdapter[${name}]: state persisted`)({});
        })
        .catch((error) => {
          Logger.error(`LocalAdapter[${name}]: failed to persist state`)(error);
        });
    },

    onLogout: () => {
      Logger.log(`LocalAdapter[${name}]: clearing data on logout`)({});
      clear();
    },
  };

  if (subscribe) {
    Logger.log(`LocalAdapter[${name}]: setting up subscription`)({});

    subscribe((raw: string) => {
      Logger.log(`LocalAdapter[${name}]: external change received`)({});

      const parsed = deserialize(raw);
      if (parsed === undefined) {
        Logger.error(`LocalAdapter[${name}]: failed to parse external change`)(
          {}
        );
        return;
      }

      const validated = validate(parsed);
      if (validated === undefined) {
        Logger.error(
          `LocalAdapter[${name}]: external change validation failed`
        )({});
        return;
      }

      Logger.log(`LocalAdapter[${name}]: applying external change`)({});
      adapter.change?.(validated);
    });
  }

  return adapter;
};
