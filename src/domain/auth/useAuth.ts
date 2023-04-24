import { useEffect, useMemo, useState } from "react";
import { useStorage } from "../../application/useStorage";
import {
  createUser,
  login,
  logout,
  onAuthStateChanged,
} from "../../services/backend/auth";
import { User } from "./User";
import { fromFirebase } from "./user.adapter.in.firebase";

export const useAuth = () => {
  const [isLogged, setIsLogged] = useStorage("IS_SIGNED_IN", false);
  const [user, setUser] = useState<User>();

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

  console.log("[YOUPI]", isLogged);

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
