import { $isAuthenticated, AuthState } from "../service/firebase";
import { useEffect, useState } from "react";

import { useStore } from "../store/StoreProvider";

export function useAuthentication() {
  const [state, setState] = useState<AuthState>({ type: "loading" });
  const [currentParticipantId, setCurrentParticipantId] = useStore(
    "currentParticipantId"
  );

  useEffect(() => {
    const subscription = $isAuthenticated.asObservable().subscribe({
      next: (authState) => {
        setState(authState);
        if (authState.type === "authenticated") {
          setCurrentParticipantId(() => authState.participantId);
        }
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    currentParticipantId:
      state.type === "authenticated" ? currentParticipantId : null,
  };
}
