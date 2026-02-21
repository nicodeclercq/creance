import { createStore } from "../createStore";
import type { UserData } from "../adapters/createRemoteAdapter";
import type { State } from "../state";
import {
  createEmptyAliasRegistry,
  createEmptyMappingRegistry,
} from "../adapters/shared/alias";
import { generateKey } from "../../service/crypto";
import type { SecureKeyStore } from "../../service/secureKeyStore";
import type { Event } from "../../models/Event";
import { PAST_DATE } from "../../models/mergeable";

export const TEST_CREDENTIALS = { login: "testuser", password: "testpass" };

export const createMockSecureKeyStore = (): SecureKeyStore => {
  let storedKey: string | undefined;
  return {
    store: (userKey: string) => {
      storedKey = userKey;
      return Promise.resolve();
    },
    retrieve: () => Promise.resolve(storedKey),
    clear: () => {
      storedKey = undefined;
      return Promise.resolve();
    },
  };
};

export const preAuthenticate = (
  storage: Storage,
  secureKeyStore?: SecureKeyStore,
): Promise<string> =>
  generateKey(TEST_CREDENTIALS.password).then((userKey) => {
    storage.setItem(
      "creance-auth",
      JSON.stringify({ type: "authenticated" }),
    );
    return (secureKeyStore?.store(userKey) ?? Promise.resolve()).then(
      () => userKey,
    );
  });

export const createTestUserData = (state: State): UserData => ({
  knownEvents: {},
  knownAliases: createEmptyAliasRegistry(),
  aliasMappings: createEmptyMappingRegistry(),
  state,
  updatedAt: state.updatedAt,
});

export const createTestState = (
  overrides: {
    events?: Record<string, Event>;
    updatedAt?: Date;
    defaultDate?: Date;
  } = {},
): State => {
  const baseDate = overrides.defaultDate ?? overrides.updatedAt ?? PAST_DATE;
  return {
    version: 1,
    updatedAt: overrides.updatedAt ?? baseDate,
    account: {
      currentUser: {
        _id: "user-1",
        name: "Test User",
        avatar: "/avatar.svg",
        share: { adults: 1, children: 0 },
        updatedAt: PAST_DATE,
      },
      events: { collection: {}, updatedAt: PAST_DATE },
      updatedAt: PAST_DATE,
    },
    users: {
      collection: {
        "user-1": {
          _id: "user-1",
          name: "Test User",
          avatar: "/avatar.svg",
          share: { adults: 1, children: 0 },
          updatedAt: PAST_DATE,
        },
      },
      updatedAt: PAST_DATE,
    },
    events: {
      collection: overrides.events ?? {},
      updatedAt: overrides.updatedAt ?? baseDate,
    },
  };
};

export const getReadyData = (
  store: ReturnType<typeof createStore<State>>,
): State => {
  const state = store.getState();
  if (state.status !== "ready")
    throw new Error(`Expected ready, got ${state.status}`);
  return state.data;
};
