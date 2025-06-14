import { $isAuthenticated, AuthState } from "../service/firebase";
import { useEffect, useState } from "react";

import { useStore } from "../store/StoreProvider";

export function useAuthentication() {
  const [state, setState] = useState<AuthState>({ type: "loading" });
  const [currentUserId, setCurrentUserId] = useStore("currentUserId");

  useEffect(() => {
    const subscription = $isAuthenticated.asObservable().subscribe({
      next: (authState) => {
        setState(authState);
        if (authState.type === "authenticated") {
          setCurrentUserId(() => authState.userId);
        }
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    currentUserId: state.type === "authenticated" ? currentUserId : null,
  };
}
