import { AuthState, listenToAuthChange } from "../service/firebase";
import { useEffect, useState } from "react";

import { useStore } from "../store/StoreProvider";

export function useAuthentication() {
  const [state, setState] = useState<AuthState>({ type: "loading" });
  const [currentUserId] = useStore("currentUserId");

  useEffect(() => listenToAuthChange(setState), []);

  return {
    state,
    currentUserId: state.type === "authenticated" ? currentUserId : null,
  };
}
