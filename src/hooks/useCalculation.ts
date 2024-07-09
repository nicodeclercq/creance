import { useMemo } from "react";

import { getUsersExpenses } from "./../services/CalculationService";
import {
  getTotalExpense,
  getUserCost,
  getUsersCosts,
  getUsersRepartition,
} from "../services/CalculationService";
import { useCreanceState } from "./useCreanceState";

export const useCalculation = (id: string) => {
  const { getState } = useCreanceState(id);
  const state = getState();
  const total = useMemo(() => getTotalExpense(state), [state]);
  const userCost = useMemo(() => getUserCost(state), [state]);
  const usersCosts = useMemo(() => getUsersCosts(state), [state]);
  const usersRepartition = useMemo(() => getUsersRepartition(state), [state]);
  const usersExpense = useMemo(() => getUsersExpenses(state), [state]);

  return {
    getTotalExpense: total,
    getUserCost: userCost,
    getUsersCosts: usersCosts,
    getUsersRepartition: usersRepartition,
    getUsersExpense: usersExpense,
  };
};
