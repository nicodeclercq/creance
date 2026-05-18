import type { User } from "../models/User";
import { useData } from "./useData";
import { useParams } from "react-router-dom";

export function useCurrentUser() {
  const { eventId } = useParams();
  const [account, setAccount] = useData("account");

  const eventUserId = eventId
    ? account.events.collection[eventId]?.uid
    : undefined;

  const isCurrentUser = (user: User) => {
    if (!user) {
      return false;
    }

    const isCurrentUserId = user._id === account.currentUser._id;
    const isEventUserId = eventId && user._id === eventUserId;

    return isCurrentUserId || isEventUserId;
  };

  const setCurrentUser = (user: User | ((user: User) => User)) => {
    const newUser =
      typeof user === "function" ? user(account.currentUser) : user;

    setAccount((account) => ({
      ...account,
      currentUser: newUser,
    }));
  };

  return {
    currentUser: {
      ...account.currentUser,
      _id: eventUserId ?? account.currentUser._id,
    },
    get userId() {
      return eventUserId ?? account.currentUser._id;
    },
    setCurrentUser,
    isCurrentUser,
  };
}
