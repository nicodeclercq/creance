import { storageFileName } from "../secrets";

export function resetStore() {
  localStorage.removeItem("state");
  caches.delete(storageFileName).catch(console.error);
  location.reload();
}
