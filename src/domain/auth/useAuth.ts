import { useEffect, useMemo, useState } from "react";
import { useStorage } from "../../application/useStorage";
import {
  createUser,
  login,
  logout,
  onAuthStateChanged,
} from "../../services/backend/auth";
import { CurrentUser } from "./User";
import { fromFirebase } from "./user.adapter.firebase";

export const useAuth = () => {
  const [isLogged, setIsLogged] = useStorage("IS_SIGNED_IN", false);
  const [user, setUser] = useState<CurrentUser>();

  useEffect(() => {
    onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        setUser(fromFirebase(user));
      } else {
        setIsLogged(false);
        setUser(undefined);
      }
    });
  }, []);

  return useMemo(
    () =>
      ({
        isLogged,
        user,
        signIn: createUser,
        connect: login,
        disconnect: logout,
      } as const),
    [isLogged]
  );
};
