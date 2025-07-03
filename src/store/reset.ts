import { logoutParticipant } from "../service/firebase";

export function resetStore() {
  logoutParticipant();
  localStorage.removeItem("state");
  location.reload();
}
