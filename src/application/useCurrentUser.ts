import { User } from "../domain/auth/User";
import { useSyncStateByLens } from "./useSyncState";

export const useCurrentUser = () => {
  return useSyncStateByLens(
    (s) => s.users[s.currentUser],
    (newUser: User) => (s) => ({
      ...s,
      currentUser: newUser.uid,
      users: {
        ...s.users,
        [newUser.uid]: newUser,
      },
    })
  );
};
