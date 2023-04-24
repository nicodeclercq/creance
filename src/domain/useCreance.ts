import { useState } from "react";
import {
  Creance,
  DraftCreance,
  createDraftCreance,
  toCreance,
} from "./Creance";

export const useCreance = () => {
  const [list, setList] = useState<Creance[]>([
    toCreance(createDraftCreance({ name: "toto" })),
  ]);

  const addCreance = (creance: DraftCreance) => {
    setList([...list, toCreance(creance)]);
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
