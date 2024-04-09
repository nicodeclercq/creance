import { useState } from "react";
import {
  Creance,
  DraftCreance,
  createDraftCreance,
  draftToCreance,
} from "../domain/Creance";
import { useSyncState } from "./useSyncState";

export const useCreance = () => {
  const [list, setList] = useSyncState("creanceList");

  const addCreance = (creance: DraftCreance) => {
    setList([...list, draftToCreance(creance)]);
  };

  const removeCreance = (id: Creance["id"]) => {
    setList(list.filter((creance) => creance.id !== id));
  };

  return {
    list,
    addCreance,
    removeCreance,
  };
};
