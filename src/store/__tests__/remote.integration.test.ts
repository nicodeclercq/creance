import {
  createMockSecureKeyStore,
  createTestState,
  createTestUserData,
  getReadyData,
  preAuthenticate,
} from "./builders";
import { describe, expect, it, vi } from "vitest";

import { AuthManagerFactory } from "../adapters/AuthManager";
import type { Event } from "../../models/Event";
import type { State } from "../state";
import { createEvent } from "../../service/test-helpers";
import { createInMemoryBackend } from "./createInMemoryBackend";
import { createInMemoryLocalStorage } from "./createInMemoryLocalStorage";
import { createLocalAdapter } from "../adapters/createLocalAdapter";
import { createMemoryStorage } from "./createMemoryStorage";
import { createRemoteAdapter } from "../adapters/createRemoteAdapter";
import { createStore } from "../createStore";
import { encryptState } from "../adapters/shared/e2ee";

vi.mock("../../service/secureKeyStore", () => ({
  createSecureKeyStore: () => ({
    store: () => Promise.resolve(),
    retrieve: () => Promise.resolve(undefined),
    clear: () => Promise.resolve(),
  }),
}));

const d1 = new Date("2026-01-01T00:00:00Z");

describe("Remote adapter integration", () => {
  it("skips load when not authenticated", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();
    const local = createInMemoryLocalStorage();

    const store = createStore<State, Event>({ authManager: auth });
    store.register(createLocalAdapter(local.config));
    store.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth,
      }),
    );
    await store.init();

    const data = getReadyData(store);
    expect(data.version).toBe(1);
    expect(backend.getUserData()).toBeUndefined();
  });

  it("loads existing remote data when authenticated", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();

    const remoteState = createTestState({
      events: {
        "evt-remote": createEvent({
          _id: "evt-remote",
          name: "Remote Event",
          updatedAt: d1,
        }),
      },
      updatedAt: d1,
    });
    const encrypted = await encryptState(
      createTestUserData(remoteState),
      userKey,
    );
    backend.setUserData(encrypted);

    const local = createInMemoryLocalStorage();
    const store = createStore<State, Event>({ authManager: auth });
    store.register(createLocalAdapter(local.config));
    store.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth,
      }),
    );
    await store.init();

    const data = getReadyData(store);
    expect(data.events.collection["evt-remote"]).toBeDefined();
    expect(data.events.collection["evt-remote"].name).toBe("Remote Event");
  });
});
