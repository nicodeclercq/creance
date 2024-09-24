import * as RX from "rxjs/operators";

import { add, isLocked, of, remove, update } from "../services/CreanceService";

import { Store } from "../services/StoreService";
import { useObservable } from "react-use";

const creanceListObs = Store.asObservable().pipe(
  RX.map((store) => store.creances),
  RX.distinctUntilChanged()
);

export function useCreancesListState() {
  const creanceList = useObservable(creanceListObs);

  return {
    creanceList,
    add,
    update,
    remove,
    of,
    isLocked,
  } as const;
}
