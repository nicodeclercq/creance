import { DEFAULT_STATE } from "./state";
import { createContextStore } from "./store";

export const {
  StoreProvider,
  useStore,
  onChange,
  onPathChange,
  load,
  get,
  update,
  $store,
} = createContextStore(DEFAULT_STATE);
