import * as z from "zod";
import {
  type Observable,
  type Subscription,
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  of,
  timeout,
} from "rxjs";
import { pipe } from "fp-ts/function";

import type { RemoteAdapter } from "../createStore";
import type { State } from "../state";
import { stateSchema } from "../state";
import type { Event } from "../../models/Event";
import { eventSchema } from "../../models/Event";
import { Logger } from "../../service/Logger";
import { merge } from "./shared/merge";
import { encryptState, decryptState } from "./shared/e2ee";
import { type AuthManager, getDefaultAuthManager } from "./AuthManager";

const dateSchema = z.union([
  z.string().transform((date) => new Date(date)),
  z.date(),
]);

const userDataSchema = z.strictObject({
  state: stateSchema,
  updatedAt: dateSchema,
});

export type UserData = z.infer<typeof userDataSchema>;

export type RemoteOperations = {
  name: string;
  login: RemoteAdapter<unknown, unknown>["login"];
  signup: RemoteAdapter<unknown, unknown>["signup"];
  logout: RemoteAdapter<unknown, unknown>["logout"];
  getUserData: () => Observable<string | undefined>;
  setUserData: (encryptedData: string) => Promise<void>;
  getEventData?: (eventId: string) => Observable<string | undefined>;
  setEventData?: (eventId: string, encryptedData: string) => Promise<void>;
  deleteEventData?: (eventId: string) => Promise<void>;
};

export type RemoteAdapterConfig = {
  operations: RemoteOperations;
  authManager?: AuthManager;
};

const FIRST_REMOTE_EMISSION_TIMEOUT_MS = 3000;

const createEmptyUserData = (state: State): UserData => ({
  state,
  updatedAt: new Date(),
});

const decryptAndValidate = <T extends z.ZodType>(
  encryptedData: string,
  passKey: string,
  schema: T,
): Promise<z.infer<T>> =>
  Promise.resolve()
    .then(() => decryptState(encryptedData, passKey))
    .then((decrypted) => {
      const validated = schema.safeParse(decrypted);

      if (!validated.success) {
        Logger.error("RemoteAdapter: decrypted data validation failed")(
          validated.error,
        );
        throw new Error("Decrypted data validation failed");
      }
      return validated.data as z.infer<T>;
    });

export const createRemoteAdapter = ({
  operations,
  authManager = getDefaultAuthManager(),
}: RemoteAdapterConfig): RemoteAdapter<State, Event> => {
  Logger.log(`RemoteAdapter[${operations.name}]: creating`)({});

  const state: {
    userData: UserData | undefined;
    subscriptions: {
      user: Subscription | undefined;
      events: Record<string, Subscription | undefined>;
    };
  } = {
    userData: undefined,
    subscriptions: {
      user: undefined,
      events: {},
    },
  };

  const saveAllEvents = (events: Record<string, Event>): void => {
    if (!operations.setEventData) return;

    Object.entries(events).forEach(([eventId, event]) => {
      saveEventData(eventId, event);
    });
  };

  const handleRemoteData = (
    remoteUserData: UserData | undefined,
    prev: State | undefined,
  ): State | undefined => {
    if (remoteUserData === undefined) {
      if (prev === undefined) {
        return undefined;
      }

      state.userData = createEmptyUserData(prev);
      // Remote has no data — push local state to remote
      saveUserData(state.userData);
      saveAllEvents(prev.events.collection);
      return prev;
    }

    if (prev === undefined) {
      state.userData = remoteUserData;
      return remoteUserData.state;
    }

    const localUserData = state.userData ?? createEmptyUserData(prev);
    const mergedUserData = merge(localUserData, remoteUserData);
    const mergedState = merge(localUserData.state, remoteUserData.state);
    state.userData = { ...mergedUserData, state: mergedState };
    cleanupDeletedEvents(mergedState.events.collection);
    return mergedState;
  };

  const unsubscribeAll = () => {
    state.subscriptions.user?.unsubscribe();
    Object.values(state.subscriptions.events).forEach((subscription) =>
      subscription?.unsubscribe(),
    );
    state.subscriptions = {
      user: undefined,
      events: {},
    };
  };

  const applyRemoteEventUpdate = (
    actualEventId: string,
    remoteEvent: Event,
  ): void => {
    const currentState = state.userData?.state;
    if (!currentState || !adapter.change) {
      return;
    }

    const localEvent = currentState.events.collection[actualEventId];
    const mergedEvent = localEvent
      ? merge(localEvent, remoteEvent)
      : remoteEvent;

    adapter.change({
      ...currentState,
      events: {
        collection: {
          ...currentState.events.collection,
          [actualEventId]: mergedEvent,
        },
        updatedAt:
          mergedEvent.updatedAt > currentState.events.updatedAt
            ? mergedEvent.updatedAt
            : currentState.events.updatedAt,
      },
    });
  };

  const getEventSubscriptions = () => {
    const accountEvents =
      state.userData?.state.account.events.collection ?? {};

    return Object.entries(accountEvents).reduce(
      (acc, [actualEventId, { eventId: passKey }]) => {
        acc[actualEventId] = operations
          .getEventData?.(actualEventId)
          .pipe(distinctUntilChanged())
          .subscribe({
            next: (encryptedData) => {
              if (encryptedData == null) {
                return;
              }

              Promise.resolve(encryptedData)
                .then((encryptedEvent) =>
                  decryptAndValidate(encryptedEvent, passKey, eventSchema),
                )
                .then((remoteEvent) => {
                  applyRemoteEventUpdate(actualEventId, remoteEvent);
                })
                .catch((error) => {
                  Logger.error(
                    `RemoteAdapter[${operations.name}]: event subscription processing failed`,
                  )(error);
                });
            },
          });

        return acc;
      },
      {} as Record<string, Subscription | undefined>,
    );
  };

  const setupSubscription = (): void => {
    unsubscribeAll();

    const userKey = authManager.getUserKey();
    if (!userKey) {
      return;
    }

    state.subscriptions.user = operations
      .getUserData()
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (encryptedData) => {
          if (encryptedData === undefined) {
            return;
          }

          decryptAndValidate(encryptedData, userKey, userDataSchema)
            .then((remoteUserData) => {
              const currentState = state.userData?.state;
              const mergedState = handleRemoteData(
                remoteUserData,
                currentState,
              );
              if (mergedState && adapter.change) {
                adapter.change(mergedState);
              }
            })
            .catch((error) => {
              Logger.error(
                `RemoteAdapter[${operations.name}]: subscription processing failed`,
              )(error);
            });
        },
        error: (error) => {
          Logger.error(`RemoteAdapter[${operations.name}]: subscription error`)(
            error,
          );
        },
      });
    state.subscriptions.events = getEventSubscriptions();
  };

  const fetchAndMerge = (
    userKey: string,
    prev: State | undefined,
  ): Promise<State | undefined> =>
    firstValueFrom(
      operations.getUserData().pipe(
        distinctUntilChanged(),
        timeout({ first: FIRST_REMOTE_EMISSION_TIMEOUT_MS }),
        catchError((error) => {
          Logger.error(
            `RemoteAdapter[${operations.name}]: getUserData first emission timeout or error`,
          )(error);
          return of(undefined);
        }),
      ),
    )
      .then((encryptedData: string | undefined) =>
        Promise.resolve().then(() =>
          encryptedData === undefined
            ? handleRemoteData(undefined, prev)
            : decryptAndValidate(encryptedData, userKey, userDataSchema).then(
                (remoteUserData) => handleRemoteData(remoteUserData, prev),
              ),
        ),
      )
      .catch((error) => {
        Logger.error(`RemoteAdapter[${operations.name}]: fetchAndMerge failed`)(
          error,
        );
        return prev;
      });

  const load = (prev: State | undefined): Promise<State | undefined> => {
    const authState = authManager.getState();

    if (authState.type !== "authenticated") {
      Logger.log(
        `RemoteAdapter[${operations.name}]: not authenticated, skipping load`,
      )({});
      return Promise.resolve(prev);
    }

    return fetchAndMerge(authState.userKey, prev).then((result) => {
      setupSubscription();
      return result;
    });
  };

  const saveUserData = (userData: UserData): Promise<void> => {
    const userKey = authManager.getUserKey();
    if (!userKey) {
      return Promise.resolve();
    }

    return encryptState(userData, userKey)
      .then((encrypted) => operations.setUserData(encrypted))
      .catch((error) => {
        Logger.error(`RemoteAdapter[${operations.name}]: saveUserData failed`)(
          error,
        );
      });
  };

  const saveEventData = (eventId: string, event: Event): Promise<void> => {
    if (!operations.setEventData || !authManager.getUserKey()) {
      return Promise.resolve();
    }

    const knownEvent = state.userData?.state.account.events.collection[eventId];
    const eventKey = knownEvent?.eventId;

    if (!eventKey) {
      return Promise.reject("No event key found");
    }

    return encryptState(event, eventKey as string)
      .then((encrypted) => {
        // Skip save if event was deleted during encryption
        if (!state.userData?.state.account.events.collection[eventId]) {
          Logger.log("Skip event saving, it was deelted during encryption");
          return;
        }

        return operations.setEventData!(eventId, encrypted);
      })
      .catch((error) => {
        Logger.error(`RemoteAdapter[${operations.name}]: saveEventData failed`)(
          error,
        );
      });
  };

  // TODO: change deletion workflow
  const cleanupDeletedEvents = (
    _currentEvents: Record<string, Event>,
  ): void => {
    // TODO
  };

  const hasEventsListChanged = (newState: State) => {
    const currentIds = Object.keys(
      state.userData?.state.account.events.collection ?? {},
    )
      .sort()
      .join("|");
    const newIds = Object.keys(newState.account.events.collection)
      .sort()
      .join("|");

    return currentIds !== newIds;
  };

  const onChange = (newState: State): void => {
    if (authManager.getState().type !== "authenticated") {
      return;
    }

    state.userData = state.userData
      ? { ...state.userData, state: newState, updatedAt: new Date() }
      : createEmptyUserData(newState);

    cleanupDeletedEvents(newState.events.collection);
    saveUserData(state.userData);

    if (operations.setEventData) {
      Object.entries(newState.events.collection).forEach(([eventId, event]) => {
        saveEventData(eventId, event);
      });
    }

    if (hasEventsListChanged(newState)) {
      state.subscriptions.events = getEventSubscriptions();
    }
  };

  const dispose = (): void => {
    unsubscribeAll();
  };

  const onLogout = (): void => {
    Logger.log(`RemoteAdapter[${operations.name}]: logout`)({});
    dispose();
    state.userData = undefined;
  };

  const fetchItem = (id: string, passKey: string) => {
    const fetcher = operations.getEventData;

    if (!fetcher) {
      return Promise.reject("Operation missing on adapter");
    }

    return pipe(id, fetcher, firstValueFrom, (result) =>
      result
        .then((value) => {
          if (!value) {
            return Promise.reject("Unknown event");
          }

          return decryptAndValidate(value as string, passKey, eventSchema).then(
            (data) => data,
          );
        })
        .catch((e) => {
          Logger.error("ERROR")(z.prettifyError(e));
          throw new Error(z.prettifyError(e.message));
        }),
    );
  };

  const adapter: RemoteAdapter<State, Event> = {
    load,
    onChange,
    onLogout,
    login: (credentials) => operations.login(credentials),
    signup: (credentials) => operations.signup(credentials),
    logout: () => operations.logout().then(() => onLogout()),
    fetchItem,
  };

  return adapter;
};
