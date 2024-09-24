import * as RX from "rxjs/operators";

import {
  add,
  get,
  getAll,
  isLocked,
  of,
  remove,
  update,
} from "../services/CreanceService";

import { Store } from "../services/StoreService";
import { useObservable } from "react-use";

const getCreanceById = (id: string) =>
  Store.asObservable().pipe(
    RX.map((store) => store.creances.find((creance) => creance.id === id)),
    RX.distinctUntilChanged()
  );

export function useCreanceState(id: string) {
  const currentCreance = useObservable(getCreanceById(id));

  return {
    get,
    getAll,
    currentCreance,
    add,
    update,
    remove,
    of,
    isLocked,
  } as const;
}
