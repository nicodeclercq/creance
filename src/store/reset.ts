import { logoutUser } from "../service/firebase";

export function resetStore() {
  logoutUser();
  localStorage.removeItem("state");
  location.reload();
}
