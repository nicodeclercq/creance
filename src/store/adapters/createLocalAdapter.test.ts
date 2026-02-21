import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLocalAdapter, type LocalAdapterConfig } from "./createLocalAdapter";
import type { State } from "../state";
import { PAST_DATE } from "../../models/mergeable";

const createValidState = (): State => ({
  version: 1,
  users: { collection: {}, updatedAt: PAST_DATE },
  events: { collection: {}, updatedAt: PAST_DATE },
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
  updatedAt: PAST_DATE,
});

const createMockConfig = () => {
  const mockRead = vi.fn<() => Promise<string | undefined> | string | undefined>();
  const mockWrite = vi.fn<(data: string) => Promise<void> | void>();
  const mockClear = vi.fn();
  return {
    name: "TestAdapter",
    read: mockRead,
    write: mockWrite,
    clear: mockClear,
    mockRead,
    mockWrite,
    mockClear,
  };
};

describe("createLocalAdapter", () => {
  let config: ReturnType<typeof createMockConfig>;

  beforeEach(() => {
    config = createMockConfig();
  });

  describe("load", () => {
    it("returns prev when read returns undefined", async () => {
      config.mockRead.mockResolvedValue(undefined);
      const adapter = createLocalAdapter(config);
      const prev = createValidState();

      const result = await adapter.load(prev);

      expect(result).toBe(prev);
    });

    it("returns default state when read returns undefined and no prev", async () => {
      config.mockRead.mockResolvedValue(undefined);
      const adapter = createLocalAdapter(config);

      const result = await adapter.load(undefined);

      expect(result).toBeDefined();
      expect(result?.version).toBe(1);
      expect(result?.events.collection).toEqual({});
      expect(result?.users.collection).toEqual({});
    });

    it("returns prev when deserialization fails", async () => {
      config.mockRead.mockResolvedValue("invalid json {");
      const adapter = createLocalAdapter(config);
      const prev = createValidState();

      const result = await adapter.load(prev);

      expect(result).toBe(prev);
    });

    it("loads and validates stored state", async () => {
      const storedState = createValidState();
      config.mockRead.mockResolvedValue(JSON.stringify(storedState));
      const adapter = createLocalAdapter(config);

      const result = await adapter.load(undefined);

      expect(result).toBeDefined();
      expect(result?.version).toBe(1);
    });

    it("merges with prev state when both exist", async () => {
      const storedState = createValidState();
      storedState.users = {
        collection: {
          "user-2": {
            _id: "user-2",
            name: "Stored User",
            avatar: "/stored.svg",
            share: { adults: 1, children: 0 },
            updatedAt: new Date("2025-01-02"),
          },
        },
        updatedAt: new Date("2025-01-02"),
      };
      config.mockRead.mockResolvedValue(JSON.stringify(storedState));
      const adapter = createLocalAdapter(config);
      const prev = createValidState();

      const result = await adapter.load(prev);

      expect(result).toBeDefined();
      expect(result?.users.collection["user-2"]).toBeDefined();
    });

    it("works with synchronous read function", async () => {
      const storedState = createValidState();
      const syncConfig: LocalAdapterConfig = {
        name: "SyncAdapter",
        read: () => JSON.stringify(storedState),
        write: vi.fn(),
        clear: vi.fn(),
      };
      const adapter = createLocalAdapter(syncConfig);

      const result = await adapter.load(undefined);

      expect(result).toBeDefined();
      expect(result?.version).toBe(1);
    });

    it("returns prev when read throws", async () => {
      config.mockRead.mockRejectedValue(new Error("Read failed"));
      const adapter = createLocalAdapter(config);
      const prev = createValidState();

      const result = await adapter.load(prev);

      expect(result).toBe(prev);
    });

    it("returns undefined when read throws and no prev", async () => {
      config.mockRead.mockRejectedValue(new Error("Read failed"));
      const adapter = createLocalAdapter(config);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await adapter.load(undefined);

      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });

  describe("onChange", () => {
    it("serializes and writes state", async () => {
      config.mockWrite.mockResolvedValue(undefined);
      const adapter = createLocalAdapter(config);
      const state = createValidState();

      adapter.onChange(state);

      await vi.waitFor(() => {
        expect(config.mockWrite).toHaveBeenCalledTimes(1);
      });

      const writtenData = config.mockWrite.mock.calls[0][0];
      expect(typeof writtenData).toBe("string");
      expect(JSON.parse(writtenData)).toMatchObject({ version: 1 });
    });

    it("does not throw when write fails", async () => {
      config.mockWrite.mockRejectedValue(new Error("Write failed"));
      const adapter = createLocalAdapter(config);
      const state = createValidState();

      adapter.onChange(state);

      await vi.waitFor(() => {
        expect(config.mockWrite).toHaveBeenCalledTimes(1);
      });
    });

    it("works with synchronous write function", async () => {
      const syncWrite = vi.fn();
      const syncConfig: LocalAdapterConfig = {
        name: "SyncAdapter",
        read: vi.fn(),
        write: syncWrite,
        clear: vi.fn(),
      };
      const adapter = createLocalAdapter(syncConfig);
      const state = createValidState();

      adapter.onChange(state);

      await vi.waitFor(() => {
        expect(syncWrite).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("subscribe", () => {
    it("calls adapter.change when subscribe emits valid data", () => {
      let subscribeCallback: ((data: string) => void) | undefined;
      const configWithSubscribe: LocalAdapterConfig = {
        name: "SubscribeAdapter",
        read: vi.fn(),
        write: vi.fn(),
        clear: vi.fn(),
        subscribe: (callback) => {
          subscribeCallback = callback;
          return () => {};
        },
      };
      const adapter = createLocalAdapter(configWithSubscribe);
      const changeSpy = vi.fn();
      adapter.change = changeSpy;

      const state = createValidState();
      subscribeCallback?.(JSON.stringify(state));

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith(expect.objectContaining({ version: 1 }));
    });

    it("does not throw when adapter.change is not set", () => {
      let subscribeCallback: ((data: string) => void) | undefined;
      const configWithSubscribe: LocalAdapterConfig = {
        name: "SubscribeAdapter",
        read: vi.fn(),
        write: vi.fn(),
        clear: vi.fn(),
        subscribe: (callback) => {
          subscribeCallback = callback;
          return () => {};
        },
      };
      const adapter = createLocalAdapter(configWithSubscribe);

      const state = createValidState();
      expect(() => subscribeCallback?.(JSON.stringify(state))).not.toThrow();
      expect(adapter.change).toBeUndefined();
    });

    it("does not call change when external data fails to parse", () => {
      let subscribeCallback: ((data: string) => void) | undefined;
      const configWithSubscribe: LocalAdapterConfig = {
        name: "SubscribeAdapter",
        read: vi.fn(),
        write: vi.fn(),
        clear: vi.fn(),
        subscribe: (callback) => {
          subscribeCallback = callback;
          return () => {};
        },
      };
      const adapter = createLocalAdapter(configWithSubscribe);
      const changeSpy = vi.fn();
      adapter.change = changeSpy;

      subscribeCallback?.("invalid json {");

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it("does not call change when external data fails validation", () => {
      let subscribeCallback: ((data: string) => void) | undefined;
      const configWithSubscribe: LocalAdapterConfig = {
        name: "SubscribeAdapter",
        read: vi.fn(),
        write: vi.fn(),
        clear: vi.fn(),
        subscribe: (callback) => {
          subscribeCallback = callback;
          return () => {};
        },
      };
      const adapter = createLocalAdapter(configWithSubscribe);
      const changeSpy = vi.fn();
      adapter.change = changeSpy;

      subscribeCallback?.(JSON.stringify({ invalid: "data" }));

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it("works without subscribe option", () => {
      const configWithoutSubscribe: LocalAdapterConfig = {
        name: "NoSubscribeAdapter",
        read: vi.fn(),
        write: vi.fn(),
        clear: vi.fn(),
      };
      const adapter = createLocalAdapter(configWithoutSubscribe);

      expect(adapter.load).toBeDefined();
      expect(adapter.onChange).toBeDefined();
    });
  });

  describe("round-trip", () => {
    it("preserves state through serialize/deserialize/validate cycle", async () => {
      let stored: string | undefined;
      const storageConfig: LocalAdapterConfig = {
        name: "RoundTripAdapter",
        read: () => stored,
        write: (data) => {
          stored = data;
        },
        clear: () => {
          stored = undefined;
        },
      };
      const adapter = createLocalAdapter(storageConfig);
      const originalState = createValidState();

      adapter.onChange(originalState);
      const loadedState = await adapter.load(undefined);

      expect(loadedState).toBeDefined();
      expect(loadedState?.version).toBe(originalState.version);
      expect(loadedState?.account.currentUser.name).toBe(originalState.account.currentUser.name);
    });
  });
});
