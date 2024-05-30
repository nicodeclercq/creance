import { Func } from "../utils/functions";
import { INITIALIZATION_STEPS, Creance } from "./../models/State";

export const needInitialization = (state: Creance) => () =>
  state.initialization !== INITIALIZATION_STEPS.INITITIALIZED;

export const initializationFold =
  (state: Creance) =>
  <T>({
    onUsersInit,
    onCategoriesInit,
  }: {
    onUsersInit: Func<[], T>;
    onCategoriesInit: Func<[], T>;
  }) => {
    return state.initialization === INITIALIZATION_STEPS.INIT_USERS
      ? onUsersInit()
      : onCategoriesInit();
  };
export const getStepNb = (state: Creance) => () =>
  Object.values(INITIALIZATION_STEPS).findIndex(
    (step) => step === state.initialization
  ) + 1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getStepsCount = (_: Creance) => () =>
  Object.values(INITIALIZATION_STEPS).length - 1; // the last step is the initialized step, so it should not be counted

export const next = (state: Creance) => (): Creance => {
  const steps = Object.values(INITIALIZATION_STEPS);

  const currentStepIndex = steps.findIndex(
    (step) => step === state.initialization
  );

  const nextStep =
    steps[
      currentStepIndex < steps.length - 1
        ? currentStepIndex + 1
        : currentStepIndex
    ];

  return {
    ...state,
    initialization: nextStep,
  };
};
export const previous = (state: Creance) => (): Creance => {
  const steps = Object.values(INITIALIZATION_STEPS);

  const currentStepIndex = steps.findIndex(
    (step) => step === state.initialization
  );

  const nextStep =
    steps[currentStepIndex <= 1 ? currentStepIndex - 1 : currentStepIndex];

  return {
    ...state,
    initialization: nextStep,
  };
};
