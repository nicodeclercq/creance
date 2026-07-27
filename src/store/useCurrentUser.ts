import type { User } from "../models/User";
import { useData } from "./useData";
import { useParams } from "react-router-dom";

export function useCurrentUser() {
  const { eventId } = useParams();
  const [account, setAccount] = useData("account");

  const eventUserId = eventId
    ? account.events.collection[eventId]?.userId
    : undefined;

  const isCurrentUser = (user: User) => {
    if (!user) {
      return false;
    }

    const currentId = eventId
      ? (eventUserId ?? account.currentUser._id)
      : account.currentUser._id;

    return user._id === currentId;
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
