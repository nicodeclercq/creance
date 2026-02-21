import { describe, expect, it, vi } from "vitest";

vi.mock("../../service/secureKeyStore", () => ({
  createSecureKeyStore: () => ({
    store: () => Promise.resolve(),
    retrieve: () => Promise.resolve(undefined),
    clear: () => Promise.resolve(),
  }),
}));

import { AuthManagerFactory } from "../adapters/AuthManager";
import type { State } from "../state";
import { createEvent } from "../../service/test-helpers";
import { createInMemoryLocalStorage } from "./createInMemoryLocalStorage";
import { createLocalAdapter } from "../adapters/createLocalAdapter";
import { createMemoryStorage } from "./createMemoryStorage";
import { createStore } from "../createStore";
import { getReadyData } from "./builders";

const date = new Date("2026-01-01T00:00:00Z");

describe("Local adapter integration", () => {
  it("first connection initializes with default state", async () => {
    const local = createInMemoryLocalStorage();
    const authManager = AuthManagerFactory({ storage: createMemoryStorage() });
    const store = createStore<State>({ authManager });

    store.register(createLocalAdapter(local.config));
    await store.init();

    const data = getReadyData(store);
    expect(data.version).toBe(1);
    expect(Object.keys(data.events.collection)).toHaveLength(0);
  });

  it("persists state changes to storage", async () => {
    const local = createInMemoryLocalStorage();
    const authManager = AuthManagerFactory({ storage: createMemoryStorage() });
    const store = createStore<State>({ authManager });

    store.register(createLocalAdapter(local.config));
    await store.init();

    const event = createEvent({ _id: "evt-1", updatedAt: date });
    store.updateState((prev) => ({
      ...prev,
      events: {
        collection: { [event._id]: event },
        updatedAt: date,
      },
      updatedAt: date,
    }));

    await vi.waitFor(() => {
      const raw = local.getData();
      expect(raw).toBeDefined();
      const parsed = JSON.parse(raw!) as State;
      expect(parsed.events.collection["evt-1"]).toBeDefined();
    });
  });

  it("second connection loads persisted state", async () => {
    const local = createInMemoryLocalStorage();

    // First connection
    const authManager1 = AuthManagerFactory({ storage: createMemoryStorage() });
    const store1 = createStore<State>({ authManager: authManager1 });
    store1.register(createLocalAdapter(local.config));
    await store1.init();

    const event = createEvent({
      _id: "evt-1",
      name: "Vacation",
      updatedAt: date,
    });
    store1.updateState((prev) => ({
      ...prev,
      events: {
        collection: { [event._id]: event },
        updatedAt: date,
      },
      updatedAt: date,
    }));

    await vi.waitFor(() => {
      expect(local.getData()).toBeDefined();
      expect(
        (JSON.parse(local.getData()!) as State).events.collection["evt-1"],
      ).toBeDefined();
    });

    // Second connection — same local storage
    const authManager2 = AuthManagerFactory({ storage: createMemoryStorage() });
    const store2 = createStore<State>({ authManager: authManager2 });
    store2.register(createLocalAdapter(local.config));
    await store2.init();

    const data = getReadyData(store2);
    expect(data.events.collection["evt-1"]).toBeDefined();
    expect(data.events.collection["evt-1"].name).toBe("Vacation");
  });
});
