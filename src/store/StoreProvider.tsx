import { DEFAULT_STATE } from "./state";
import { createContextStore } from "./store";

export const { StoreProvider, useStore, onChange, load } =
  createContextStore(DEFAULT_STATE);
