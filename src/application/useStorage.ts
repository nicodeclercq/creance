import { identity, pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import * as IOT from "io-ts-types";
import * as IOReporter from "io-ts-reporters";
import { useEffect, useId, useState } from "react";

const KEYS = {
  IS_SIGNED_IN: {
    codec: IOT.BooleanFromString,
    isPersistant: true,
  },
  TEST: {
    codec: IOT.NumberFromString,
    isPersistant: false,
  },
} as const;

type Keys = typeof KEYS;
type Key = keyof Keys;
type ExternalType<K extends Key> = Parameters<Keys[K]["codec"]["encode"]>[0];

const listeners = [] as { id: string; setValue: (newValue: any) => void }[];

const getStorageByKey = (key: Key) =>
  KEYS[key].isPersistant ? localStorage : sessionStorage;

export const useStorage = <K extends Key>(
  name: K,
  defaultValue: ExternalType<K>
) => {
  const setLocal = (data: ExternalType<K>) =>
    pipe(
      // FIXME: ts does not understand this generic
      // @ts-ignore
      data,
      KEYS[name].codec.encode,
      (value) => {
        const storage = getStorageByKey(name);
        storage.setItem(name, value);
        setValue(data);
      }
    );

  const getLocal = (): Either.Either<Error, ExternalType<K>> =>
    pipe(
      getStorageByKey(name),
      (storage) => storage.getItem(name) ?? "",
      // FIXME: ts does not understand this generic
      // @ts-ignore
      KEYS[name].codec.decode,
      Either.mapLeft(IOReporter.formatValidationErrors),
      Either.mapLeft((e: string[]) => {
        new Error(`Invalid stored value:\n${e.join("\n")}`);
        IOReporter.formatValidationErrors;
      })
    );

  const getLocalOrElse = (defaultValue: ExternalType<K>) =>
    pipe(
      getLocal(),
      Either.fold(() => {
        setLocal(defaultValue);
        return defaultValue;
      }, identity)
    );

  const id = useId();
  const [value, setValue] = useState<ExternalType<K>>(
    getLocalOrElse(defaultValue)
  );

  useEffect(() => {
    listeners.push({ id, setValue });

    return () => {
      listeners.splice(
        listeners.findIndex((a) => a.id === id),
        1
      );
    };
  }, []);

  useEffect(() => {
    listeners.forEach((listener) => {
      if (listener.id !== id) {
        listener.setValue(value);
      }
    });
  }, [value]);

  return [value, setLocal] as const;
};
