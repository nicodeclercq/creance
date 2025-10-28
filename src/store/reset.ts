import { clearCache } from "./private/cacheStorage";
import { logoutUser } from "./private/firebase";

export function resetStore() {
  logoutUser();
  localStorage.removeItem("state");
  clearCache();
  location.reload();
}
