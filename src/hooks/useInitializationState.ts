import {
  needInitialization,
  initializationFold,
  getStepNb,
  getStepsCount,
  next,
  previous,
} from "../services/InitializationService";

export const useInitializationState = (id: string) => {
  return {
    needInitialization: needInitialization(id),
    initializationFold: initializationFold(id),
    getStepNb: getStepNb(id),
    getStepsCount,
    next: next(id),
    previous: previous(id),
  };
};
