import { isAuthenticated } from "../service/firebase";
import { useStore } from "../store/StoreProvider";

export function useAuthentication() {
  const isAuth = isAuthenticated();
  const [currentUserId] = useStore("currentUserId");

  return {
    isAuthenticated: isAuth,
    currentUserId: isAuth ? currentUserId : null,
  };
}
