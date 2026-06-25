import {
  TEST_CREDENTIALS,
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
import { generateKey } from "../../service/crypto";
import { createInMemoryBackend } from "./createInMemoryBackend";
import { createInMemoryLocalStorage } from "./createInMemoryLocalStorage";
import { createLocalAdapter } from "../adapters/createLocalAdapter";
import { createMemoryStorage } from "./createMemoryStorage";
import { createRemoteAdapter } from "../adapters/createRemoteAdapter";
import { createStore } from "../createStore";
import { encryptState } from "../adapters/shared/e2ee";
import { InitTasksAdapter } from "../adapters/createInitTasksAdapter";

vi.mock("../../service/secureKeyStore", () => ({
  createSecureKeyStore: () => ({
    store: () => Promise.resolve(),
    retrieve: () => Promise.resolve(undefined),
    clear: () => Promise.resolve(),
  }),
}));

const d1 = new Date("2026-01-01T00:00:00Z");
const d2 = new Date("2026-01-02T00:00:00Z");
const d3 = new Date("2026-01-03T00:00:00Z");

describe("Full integration (local + remote)", () => {
  it("first connection: pushes local state to remote when remote is empty", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    await preAuthenticate(authStorage, secureKeyStore);
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

    expect(getReadyData(store).version).toBe(1);

    await vi.waitFor(() => {
      expect(backend.getUserData()).toBeDefined();
    });
  });

  it("first connection with existing remote data: merges into local", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();

    const remoteState = createTestState({
      events: {
        "evt-r": createEvent({
          _id: "evt-r",
          name: "From Remote",
          updatedAt: d2,
        }),
      },
      updatedAt: d2,
    });
    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );

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
    expect(data.events.collection["evt-r"]).toBeDefined();
    expect(data.events.collection["evt-r"].name).toBe("From Remote");

    await vi.waitFor(() => {
      const parsed = JSON.parse(local.getData()!) as State;
      expect(parsed.events.collection["evt-r"]).toBeDefined();
    });
  });

  it("second connection: preserves state when both sides agree", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    await preAuthenticate(authStorage, secureKeyStore);
    const auth1 = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();
    const local = createInMemoryLocalStorage();

    const store1 = createStore<State, Event>({ authManager: auth1 });
    store1.register(createLocalAdapter(local.config));
    store1.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth1,
      }),
    );
    await store1.init();

    const event = createEvent({
      _id: "evt-1",
      name: "Trip",
      updatedAt: d1,
    });
    store1.updateState((prev) => ({
      ...prev,
      events: {
        collection: { [event._id]: event },
        updatedAt: d1,
      },
      updatedAt: d1,
    }));

    await vi.waitFor(() => {
      expect(backend.getUserData()).toBeDefined();
      expect(local.getData()).toBeDefined();
    });

    const auth2 = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const store2 = createStore<State, Event>({ authManager: auth2 });
    store2.register(createLocalAdapter(local.config));
    store2.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth2,
      }),
    );
    await store2.init();

    const data = getReadyData(store2);
    expect(data.events.collection["evt-1"]).toBeDefined();
    expect(data.events.collection["evt-1"].name).toBe("Trip");
  });

  it("second connection: local added event (local is winner) is preserved", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const backend = createInMemoryBackend();

    const eventA = createEvent({
      _id: "evt-a",
      name: "Event A",
      updatedAt: d1,
    });

    const remoteState = createTestState({
      events: { "evt-a": eventA },
      updatedAt: d1,
    });
    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );

    const eventB = createEvent({
      _id: "evt-b",
      name: "Event B",
      updatedAt: d2,
    });
    const localState = createTestState({
      events: { "evt-a": eventA, "evt-b": eventB },
      updatedAt: d2,
    });
    const local = createInMemoryLocalStorage();
    local.setData(JSON.stringify(localState));

    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
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
    expect(data.events.collection["evt-a"]).toBeDefined();
    expect(data.events.collection["evt-b"]).toBeDefined();
  });

  it("second connection: remote added event (remote is winner) is preserved", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const backend = createInMemoryBackend();

    const eventA = createEvent({
      _id: "evt-a",
      name: "Event A",
      updatedAt: d1,
    });

    const localState = createTestState({
      events: { "evt-a": eventA },
      updatedAt: d1,
    });
    const local = createInMemoryLocalStorage();
    local.setData(JSON.stringify(localState));

    const eventC = createEvent({
      _id: "evt-c",
      name: "Event C",
      updatedAt: d3,
    });
    const remoteState = createTestState({
      events: { "evt-a": eventA, "evt-c": eventC },
      updatedAt: d3,
    });
    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );

    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
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
    expect(data.events.collection["evt-a"]).toBeDefined();
    expect(data.events.collection["evt-c"]).toBeDefined();
  });

  it("second connection: event only in loser collection is dropped (deletion)", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const backend = createInMemoryBackend();

    const eventA = createEvent({
      _id: "evt-a",
      name: "Event A",
      updatedAt: d1,
    });
    const eventB = createEvent({
      _id: "evt-b",
      name: "Event B",
      updatedAt: d1,
    });

    const localState = createTestState({
      events: { "evt-a": eventA, "evt-b": eventB },
      updatedAt: d1,
    });
    const local = createInMemoryLocalStorage();
    local.setData(JSON.stringify(localState));

    const remoteState = createTestState({
      events: { "evt-a": eventA },
      updatedAt: d2,
    });
    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );

    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
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
    expect(data.events.collection["evt-a"]).toBeDefined();
    expect(data.events.collection["evt-b"]).toBeUndefined();
  });

  it("second connection: items in both collections merge by individual timestamp", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const backend = createInMemoryBackend();

    const localA = createEvent({
      _id: "evt-a",
      name: "Local A Updated",
      updatedAt: d2,
    });
    const localB = createEvent({
      _id: "evt-b",
      name: "Local B Old",
      updatedAt: d1,
    });
    const localState = createTestState({
      events: { "evt-a": localA, "evt-b": localB },
      updatedAt: d2,
    });
    const local = createInMemoryLocalStorage();
    local.setData(JSON.stringify(localState));

    const remoteA = createEvent({
      _id: "evt-a",
      name: "Remote A Old",
      updatedAt: d1,
    });
    const remoteB = createEvent({
      _id: "evt-b",
      name: "Remote B Updated",
      updatedAt: d3,
    });
    const remoteState = createTestState({
      events: { "evt-a": remoteA, "evt-b": remoteB },
      updatedAt: d3,
    });
    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );

    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
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
    expect(data.events.collection["evt-a"].name).toBe("Local A Updated");
    expect(data.events.collection["evt-b"].name).toBe("Remote B Updated");
  });

  it("event deletion removes per-event data from backend", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    await preAuthenticate(authStorage, secureKeyStore);
    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();
    const local = createInMemoryLocalStorage();

    const store1 = createStore<State, Event>({ authManager: auth });
    store1.register(createLocalAdapter(local.config));
    store1.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth,
      }),
    );
    await store1.init();

    const evtA = createEvent({ _id: "evt-a", name: "A", updatedAt: d1 });
    const evtB = createEvent({ _id: "evt-b", name: "B", updatedAt: d1 });
    store1.updateState((prev) => ({
      ...prev,
      events: {
        collection: { "evt-a": evtA, "evt-b": evtB },
        updatedAt: d1,
      },
      updatedAt: d1,
    }));

    await vi.waitFor(() => {
      expect(backend.hasEventData("evt-a")).toBe(true);
      expect(backend.hasEventData("evt-b")).toBe(true);
    });

    store1.updateState((prev) => ({
      ...prev,
      events: {
        collection: { "evt-a": evtA },
        updatedAt: d2,
      },
      updatedAt: d2,
    }));

    await vi.waitFor(() => {
      expect(backend.hasEventData("evt-b")).toBe(false);
    });

    expect(backend.hasEventData("evt-a")).toBe(true);
  });

  it("login flow: authenticate then sync to remote", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const backend = createInMemoryBackend();
    const local = createInMemoryLocalStorage();

    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });

    const store = createStore<State, Event>({ authManager: auth });
    store.register(createLocalAdapter(local.config));
    store.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth,
      }),
    );
    await store.init();

    expect(backend.getUserData()).toBeUndefined();
    expect(auth.getState().type).toBe("initial");

    const event = createEvent({
      _id: "evt-1",
      name: "Pre-login Event",
      updatedAt: d1,
    });
    store.updateState((prev) => ({
      ...prev,
      events: {
        collection: { [event._id]: event },
        updatedAt: d1,
      },
      updatedAt: d1,
    }));

    await store.login(TEST_CREDENTIALS);

    expect(auth.getState().type).toBe("authenticated");

    await vi.waitFor(() => {
      expect(backend.getUserData()).toBeDefined();
    });
  });

  it("loads per-event remote data before init tasks run", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const userKey = await preAuthenticate(authStorage, secureKeyStore);
    const auth = AuthManagerFactory({ storage: authStorage, secureKeyStore });
    const backend = createInMemoryBackend();
    const passKey = await generateKey("event-pass");
    const event = createEvent({
      _id: "evt-remote-only",
      name: "Remote Event",
      updatedAt: d2,
    });

    const remoteState = createTestState({ updatedAt: d2 });
    remoteState.account.events = {
      collection: {
        "evt-remote-only": {
          eventId: passKey,
          userId: "user-1",
          updatedAt: d2,
        },
      },
      updatedAt: d2,
    };

    backend.setUserData(
      await encryptState(createTestUserData(remoteState), userKey),
    );
    await backend.operations.setEventData!(
      "evt-remote-only",
      await encryptState(event, passKey),
    );

    const local = createInMemoryLocalStorage();
    const store = createStore<State, Event>({ authManager: auth });
    store.register(createLocalAdapter(local.config));
    store.register(
      createRemoteAdapter({
        operations: backend.operations,
        authManager: auth,
      }),
    );
    store.register(InitTasksAdapter);
    await store.init();

    const data = getReadyData(store);
    expect(data.account.events.collection["evt-remote-only"]).toBeDefined();
    expect(data.events.collection["evt-remote-only"]).toBeDefined();
    expect(data.events.collection["evt-remote-only"].name).toBe("Remote Event");
  });

  it("logout clears state and re-initializes with defaults", async () => {
    const authStorage = createMemoryStorage();
    const secureKeyStore = createMockSecureKeyStore();
    await preAuthenticate(authStorage, secureKeyStore);
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

    const event = createEvent({
      _id: "evt-1",
      name: "Before Logout",
      updatedAt: d1,
    });
    store.updateState((prev) => ({
      ...prev,
      events: {
        collection: { [event._id]: event },
        updatedAt: d1,
      },
      updatedAt: d1,
    }));

    await vi.waitFor(() => {
      expect(backend.getUserData()).toBeDefined();
    });

    await store.logout();

    expect(auth.getState().type).toBe("initial");

    await vi.waitFor(() => {
      expect(store.getState().status).toBe("ready");
    });

    const data = getReadyData(store);
    expect(Object.keys(data.events.collection)).toHaveLength(0);
  });
});
