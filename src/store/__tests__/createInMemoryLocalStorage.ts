import type { LocalAdapterConfig } from "../adapters/createLocalAdapter";

export type InMemoryLocalStorage = {
  config: LocalAdapterConfig;
  getData: () => string | undefined;
  setData: (data: string | undefined) => void;
};

export const createInMemoryLocalStorage = (): InMemoryLocalStorage => {
  let data: string | undefined;
  return {
    config: {
      name: "InMemory",
      read: () => data,
      write: (newData: string) => {
        data = newData;
      },
      clear: () => {
        data = undefined;
      },
    },
    getData: () => data,
    setData: (newData) => {
      data = newData;
    },
  };
};
