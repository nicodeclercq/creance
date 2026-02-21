import * as z from "zod";
import {
  type Observable,
  type Subscription,
  distinctUntilChanged,
  firstValueFrom,
} from "rxjs";
import { pipe } from "fp-ts/function";

import type { RemoteAdapter } from "../createStore";
import type { State } from "../state";
import { stateSchema } from "../state";
import type { Event } from "../../models/Event";
import { eventSchema } from "../../models/Event";
import type { User } from "../../models/User";
import { Logger } from "../../service/Logger";
import { merge } from "./shared/merge";
import {
  type AliasRegistry,
  type AliasMappingRegistry,
  createUserId,
  createAliasId,
  setAlias,
  createEmptyAliasRegistry,
  createEmptyMappingRegistry,
  getOrCreateAlias,
  getAliasForUser,
  replaceUserIdsWithAliases,
} from "./shared/alias";
import { encryptState, decryptState } from "./shared/e2ee";
import { mapObject } from "../../utils/object";
import { type AuthManager, getDefaultAuthManager } from "./AuthManager";

const dateSchema = z.union([
  z.string().transform((date) => new Date(date)),
  z.date(),
]);

const knownEventSchema = z.strictObject({
  eventKey: z.string(),
  lastSyncAt: dateSchema,
});

const aliasIdSchema = z.string().transform((id) => createAliasId(id));
const userIdSchema = z.string().transform((id) => createUserId(id));

const userInfoSchema = z.strictObject({
  name: z.string(),
  avatar: z.string().optional(),
});

const aliasRegistrySchema = z.record(aliasIdSchema, userInfoSchema);
const aliasMappingRegistrySchema = z.record(userIdSchema, aliasIdSchema);

const userDataSchema = z.strictObject({
  knownEvents: z.record(z.string(), knownEventSchema),
  knownAliases: aliasRegistrySchema,
  aliasMappings: aliasMappingRegistrySchema,
  state: stateSchema,
  updatedAt: dateSchema,
});

export type UserData = z.infer<typeof userDataSchema>;

const remoteEventDataSchema = z.strictObject({
  event: eventSchema,
  participants: z.record(
    z.string(),
    z.strictObject({
      aliasId: aliasIdSchema,
      userInfo: userInfoSchema,
    }),
  ),
  updatedAt: dateSchema,
});

type RemoteEventData = z.infer<typeof remoteEventDataSchema>;

export type RemoteOperations = {
  name: string;
  login: RemoteAdapter<unknown>["login"];
  signup: RemoteAdapter<unknown>["signup"];
  logout: RemoteAdapter<unknown>["logout"];
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

const createEmptyUserData = (state: State): UserData => ({
  knownEvents: {},
  knownAliases: createEmptyAliasRegistry(),
  aliasMappings: createEmptyMappingRegistry(),
  state,
  updatedAt: new Date(),
});

type AliasAccumulator = {
  mappings: AliasMappingRegistry;
  aliases: AliasRegistry;
  participants: RemoteEventData["participants"];
};

const collectUserIds = (event: Event): string[] =>
  Object.keys(event.participants.collection);

const buildAliasAccumulator = (
  userIds: string[],
  users: Record<string, User>,
  existingMappings: AliasMappingRegistry,
): AliasAccumulator =>
  userIds.reduce<AliasAccumulator>(
    (acc, userId) => {
      const { aliasId, mappings } = pipe(userId, createUserId, (typedUserId) =>
        getOrCreateAlias(typedUserId, acc.mappings),
      );
      const user = users[userId];
      const userInfo = user
        ? { name: user.name, avatar: user.avatar }
        : { name: "Unknown" };

      return {
        mappings,
        aliases: setAlias(acc.aliases, aliasId, userInfo),
        participants: {
          ...acc.participants,
          [userId]: { aliasId, userInfo },
        },
      };
    },
    {
      mappings: existingMappings,
      aliases: createEmptyAliasRegistry(),
      participants: {},
    },
  );

const prepareEventForSharing = (
  event: Event,
  users: Record<string, User>,
  existingMappings: AliasMappingRegistry,
): {
  eventData: RemoteEventData;
  mappings: AliasMappingRegistry;
  aliases: AliasRegistry;
} => {
  const userIds = collectUserIds(event);
  const { mappings, aliases, participants } = buildAliasAccumulator(
    userIds,
    users,
    existingMappings,
  );

  const aliasedExpenses = pipe(
    event.expenses.collection,
    mapObject((expense) =>
      replaceUserIdsWithAliases(expense, "lender", mappings),
    ),
  );

  const aliasedDeposits = pipe(
    event.deposits.collection,
    mapObject((deposit) =>
      replaceUserIdsWithAliases(
        replaceUserIdsWithAliases(deposit, "from", mappings),
        "to",
        mappings,
      ),
    ),
  );

  const aliasedParticipants = Object.fromEntries(
    Object.entries(event.participants.collection).map(
      ([userId, participant]) => [
        getAliasForUser(mappings, createUserId(userId)) ?? userId,
        participant,
      ],
    ),
  );

  const aliasedMealManager = pipe(
    event.mealManager,
    mapObject((meals) =>
      replaceUserIdsWithAliases(
        replaceUserIdsWithAliases(meals, "lunch", mappings),
        "dinner",
        mappings,
      ),
    ),
  );

  const aliasedEvent: Event = {
    ...event,
    expenses: {
      collection: aliasedExpenses,
      updatedAt: event.expenses.updatedAt,
    },
    deposits: {
      collection: aliasedDeposits,
      updatedAt: event.deposits.updatedAt,
    },
    participants: {
      collection: aliasedParticipants,
      updatedAt: event.participants.updatedAt,
    },
    mealManager: aliasedMealManager,
  };

  return {
    eventData: {
      event: aliasedEvent,
      participants,
      updatedAt: event.updatedAt,
    },
    mappings,
    aliases,
  };
};

const decryptAndValidate = <T extends z.ZodType>(
  encryptedData: string,
  passKey: string,
  schema: T,
): Promise<z.infer<T>> =>
  decryptState(encryptedData, passKey).then((decrypted) => {
    const validated = schema.safeParse(decrypted);
    if (!validated.success) {
      Logger.error("RemoteAdapter: decrypted data validation failed")(
        validated.error,
      );
      throw new Error("Decrypted data validation failed");
    }
    return validated.data as z.infer<T>;
  });

const generateRandomKey = (): string =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));

export const createRemoteAdapter = ({
  operations,
  authManager = getDefaultAuthManager(),
}: RemoteAdapterConfig): RemoteAdapter<State> => {
  Logger.log(`RemoteAdapter[${operations.name}]: creating`)({});

  const state: {
    userData: UserData | undefined;
    subscription: Subscription | undefined;
  } = {
    userData: undefined,
    subscription: undefined,
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

  const setupSubscription = (): void => {
    state.subscription?.unsubscribe();

    const userKey = authManager.getUserKey();
    if (!userKey) {
      return;
    }

    state.subscription = operations
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
  };

  const fetchAndMerge = (
    userKey: string,
    prev: State | undefined,
  ): Promise<State | undefined> =>
    firstValueFrom(operations.getUserData().pipe(distinctUntilChanged()))
      .then((encryptedData: string | undefined) => {
        if (encryptedData === undefined) {
          return handleRemoteData(undefined, prev);
        }

        return decryptAndValidate(encryptedData, userKey, userDataSchema).then(
          (remoteUserData) => handleRemoteData(remoteUserData, prev),
        );
      })
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

  const ensureEventKey = (eventId: string): string => {
    if (!state.userData) {
      return generateRandomKey();
    }

    const existing = state.userData.knownEvents[eventId];
    if (existing) {
      return existing.eventKey;
    }

    const newKey = generateRandomKey();
    state.userData = {
      ...state.userData,
      knownEvents: {
        ...state.userData.knownEvents,
        [eventId]: { eventKey: newKey, lastSyncAt: new Date() },
      },
    };
    return newKey;
  };

  const saveEventData = (eventId: string, event: Event): Promise<void> => {
    if (!operations.setEventData || !authManager.getUserKey()) {
      return Promise.resolve();
    }

    const eventKey = ensureEventKey(eventId);
    const users = state.userData?.state.users.collection ?? {};
    const { eventData } = prepareEventForSharing(
      event,
      users,
      state.userData?.aliasMappings ?? createEmptyMappingRegistry(),
    );

    return encryptState(eventData, eventKey)
      .then((encrypted) => {
        // Skip save if event was deleted during encryption
        if (!state.userData?.knownEvents[eventId]) {
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

  const cleanupDeletedEvents = (currentEvents: Record<string, Event>): void => {
    if (!state.userData) {
      return;
    }

    const currentEventIds = new Set(Object.keys(currentEvents));
    const deletedEventIds = Object.keys(state.userData.knownEvents).filter(
      (id) => !currentEventIds.has(id),
    );

    if (deletedEventIds.length === 0) {
      return;
    }

    Logger.log(
      `RemoteAdapter[${operations.name}]: cleaning up ${deletedEventIds.length} deleted events`,
    )({ deletedEventIds });

    state.userData = {
      ...state.userData,
      knownEvents: Object.fromEntries(
        Object.entries(state.userData.knownEvents).filter(([id]) =>
          currentEventIds.has(id),
        ),
      ),
    };

    deletedEventIds.forEach((id) => {
      operations.deleteEventData?.(id).catch((error) => {
        Logger.error(
          `RemoteAdapter[${operations.name}]: deleteEventData failed`,
        )(error);
      });
    });
  };

  const onChange = (newState: State): void => {
    if (authManager.getState().type !== "authenticated") {
      return;
    }

    state.userData = state.userData
      ? { ...state.userData, state: newState, updatedAt: new Date() }
      : createEmptyUserData(newState);

    cleanupDeletedEvents(newState.events.collection);

    // Ensure all event keys exist before saving userData,
    // so knownEvents is complete when the encrypted userData reaches remote
    if (operations.setEventData) {
      Object.keys(newState.events.collection).forEach((eventId) => {
        ensureEventKey(eventId);
      });
    }

    saveUserData(state.userData);

    if (operations.setEventData) {
      Object.entries(newState.events.collection).forEach(([eventId, event]) => {
        saveEventData(eventId, event);
      });
    }
  };

  const dispose = (): void => {
    state.subscription?.unsubscribe();
    state.subscription = undefined;
  };

  const onLogout = (): void => {
    Logger.log(`RemoteAdapter[${operations.name}]: logout`)({});
    dispose();
    state.userData = undefined;
  };

  const adapter: RemoteAdapter<State> = {
    load,
    onChange,
    onLogout,
    login: (credentials) => operations.login(credentials),
    signup: (credentials) => operations.signup(credentials),
    logout: () => operations.logout().then(() => onLogout()),
  };

  return adapter;
};
