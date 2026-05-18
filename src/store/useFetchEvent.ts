import { useContext, useMemo } from "react";

import { StoreContext } from "./StoreProvider";

export function useFetchEvent() {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("useFetchItem must be used within a Provider");
  }

  return useMemo(() => context.fetchEvent, [context.fetchEvent]);
}
