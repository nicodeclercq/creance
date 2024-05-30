import { needInitialization, initializationFold, getStepNb, getStepsCount, next, previous } from '../services/InitializationService';
import { useCreanceState } from './useCreanceState';

export const useInitializationState = (id?: string) => {
  const { state, setState } = useCreanceState(id);

  return {
    needInitialization: needInitialization(state),
    initializationFold: initializationFold(state),
    getStepNb: getStepNb(state),
    getStepsCount: getStepsCount(state),
    next: setState(next),
    previous: setState(previous),
  }
}