import { useObservable } from "react-use";
import * as RX from "rxjs/operators";
import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import { useParams } from "react-router-dom";
import * as Registerable from "../models/Registerable";
import { Creance } from "../models/State";
import {
  of,
  get,
  getAll,
  add,
  update,
  remove,
  isLocked,
} from "../services/CreanceService";
import { Store } from "../services/StoreService";

const creanceListObs = Store.asObservable().pipe(
  RX.map((store) => store.creances),
  RX.distinctUntilChanged()
);

export function useCreanceState(id?: string) {
  const { creanceId: routeId } = useParams();
  const creanceId = id != null ? id : (routeId as string);
  const creanceList = useObservable(creanceListObs);
  const currentCreance = useObservable(
    Store.asObservable().pipe(
      RX.map((store) =>
        store.creances.find((creance) => creance.id === creanceId)
      ),
      RX.distinctUntilChanged()
    )
  );

  const getState = () =>
    pipe(
      get(creanceId),
      Either.fold(
        (e) => {
          throw e;
        },
        (creance) => creance
      )
    );

  const setState =
    <
      C extends (
        c: Registerable.Registered<Creance>
      ) => (t: T) => Registerable.Registered<Creance>,
      T
    >(
      mapper: C
    ) =>
    (entity: T) =>
      pipe(
        get(creanceId),
        Either.fold(
          (e) => {
            throw e;
          },
          (creance: Registerable.Registered<Creance>) =>
            pipe(entity, mapper(creance), update)
        )
      );

  return {
    getState,
    setState,
    get,
    getAll,
    currentCreance,
    creanceList,
    add,
    update,
    remove,
    of,
    isLocked,
  } as const;
}
