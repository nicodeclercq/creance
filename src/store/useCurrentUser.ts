import { User } from "../models/User";
import { useData } from "./useData";

export function useCurrentUser() {
  const [currentUser] = useData("account.currentUser");

  const isCurrentUser = (user: User) => user._id === currentUser._id;

  return { currentUser, isCurrentUser };
}
