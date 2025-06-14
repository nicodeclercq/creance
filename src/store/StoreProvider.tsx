import { DEFAULT_STATE } from "./state";
import { createContextStore } from "./store";

export const {
  StoreProvider,
  useStore,
  onChange,
  onPathChange,
  load,
  update,
  $store,
} = createContextStore(DEFAULT_STATE);
