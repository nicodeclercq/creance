import { Func } from "../utils/functions";
import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import * as Registerable from "./../models/Registerable";
import { INITIALIZATION_STEPS, Creance } from "./../models/State";
import * as CreanceService from "./CreanceService";

export const needInitialization =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map(
        (creance) =>
          creance.initialization !== INITIALIZATION_STEPS.INITITIALIZED
      )
    );

export const initializationFold =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) =>
  <T>({
    onUsersInit,
    onCategoriesInit,
  }: {
    onUsersInit: Func<[], T>;
    onCategoriesInit: Func<[], T>;
  }) =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map((creance) => {
        return creance.initialization === INITIALIZATION_STEPS.INIT_USERS
          ? onUsersInit()
          : onCategoriesInit();
      })
    );
export const getStepNb =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map(
        (creance) =>
          Object.values(INITIALIZATION_STEPS).findIndex(
            (step) => step === creance.initialization
          ) + 1
      )
    );

export const getStepsCount = () =>
  Object.values(INITIALIZATION_STEPS).length - 1; // the last step is the initialized step, so it should not be counted

export const next =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map((creance) => {
        const steps = Object.values(INITIALIZATION_STEPS);

        const currentStepIndex = steps.findIndex(
          (step) => step === creance.initialization
        );

        const nextStep =
          steps[
            currentStepIndex < steps.length - 1
              ? currentStepIndex + 1
              : currentStepIndex
          ];

        return {
          ...creance,
          initialization: nextStep,
        };
      }),
      Either.map(CreanceService.update)
    );
export const previous =
  (creanceId: Registerable.Registered<Creance>["id"] | undefined) => () =>
    pipe(
      creanceId,
      Either.fromNullable("Creance id is not defined"),
      Either.chain(CreanceService.get),
      Either.map((creance) => {
        const steps = Object.values(INITIALIZATION_STEPS);

        const currentStepIndex = steps.findIndex(
          (step) => step === creance.initialization
        );

        const nextStep =
          steps[
            currentStepIndex <= 1 ? currentStepIndex - 1 : currentStepIndex
          ];

        return {
          ...creance,
          initialization: nextStep,
        };
      }),
      Either.map(CreanceService.update)
    );
