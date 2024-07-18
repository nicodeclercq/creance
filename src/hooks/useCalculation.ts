import { getUsersExpenses } from "./../services/CalculationService";
import {
  getTotalExpense,
  getUserCost,
  getUsersCosts,
  getUsersRepartition,
} from "../services/CalculationService";

export const useCalculation = (id: string) => ({
  getTotalExpense: getTotalExpense(id),
  getUserCost: getUserCost(id),
  getUsersCosts: getUsersCosts(id),
  getUsersRepartition: getUsersRepartition(id),
  getUsersExpense: getUsersExpenses(id),
});
