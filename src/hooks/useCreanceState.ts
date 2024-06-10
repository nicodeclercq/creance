import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import { useParams } from "react-router-dom";

import { useStore } from "./useStore";
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

export function useCreanceState(id?: string) {
  const { state, setState } = useStore();
  const { creanceId: routeId } = useParams();

  const creanceId = id != null ? id : (routeId as string);

  const save =
    <C extends (c: Creance) => (t: T) => Creance, T>(mapper: C) =>
    (entity: T) =>
      Either.fold(
        (e) => {
          throw e;
        },
        (creance: Creance) => pipe(entity, mapper(creance), setState(update))
      )(get(state)(creanceId));

  return {
    state: state.creances.find(
      (creance) => creanceId === creance.id
    ) as Creance,
    setState: save,
    get: get(state),
    getAll: getAll(state),
    add: setState(add),
    update: setState(update),
    remove: setState(remove),
    of,
    isLocked: (creance: Creance) => isLocked(creance),
  } as const;
}
