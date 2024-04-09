import { useSyncState } from "./useSyncState";

export const useUsers = () => {
  return useSyncState("users");
};
