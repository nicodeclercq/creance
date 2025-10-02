import { logoutUser } from "./private/firebase";

export function resetStore() {
  logoutUser();
  localStorage.removeItem("state");
  location.reload();
}
