import { createStore, runAdaptersCascade } from "./createStore";
import { describe, expect, it, vi } from "vitest";

import type { Adapter } from "./createStore";
import { AuthManagerFactory } from "./adapters/AuthManager";
import { createMemoryStorage } from "./__tests__/createMemoryStorage";

vi.mock("../service/secureKeyStore", () => ({
  createSecureKeyStore: () => ({
    store: () => Promise.resolve(),
    retrieve: () => Promise.resolve(undefined),
    clear: () => Promise.resolve(),
  }),
}));

describe("runAdaptersCascade", () => {
  const createMockAdapter = <T>(
    loadFn: (prev: T | undefined) => T | undefined | Promise<T | undefined>,
  ): Adapter<T> => ({
    load: loadFn,
    onChange: () => {},
  });

  it("returns success with data from single adapter", async () => {
    const adapter = createMockAdapter<string>(() => "data");
    const result = await runAdaptersCascade<string>([adapter], undefined);

    expect(result).toStrictEqual({ success: true, data: "data" });
  });

  it("cascades state through multiple adapters", async () => {
    const adapter1 = createMockAdapter<number>(() => 1);
    const adapter2 = createMockAdapter<number>((prev) => (prev ?? 0) + 10);
    const adapter3 = createMockAdapter<number>((prev) => (prev ?? 0) * 2);

    const result = await runAdaptersCascade<number>(
      [adapter1, adapter2, adapter3],
      undefined,
    );

    expect(result).toStrictEqual({ success: true, data: 22 }); // ((1) + 10) * 2
  });

  it("skips adapter that returns undefined", async () => {
    const adapter1 = createMockAdapter<number>(() => 5);
    const adapter2 = createMockAdapter<number>(() => undefined);
    const adapter3 = createMockAdapter<number>((prev) => (prev ?? 0) + 1);

    const result = await runAdaptersCascade<number>(
      [adapter1, adapter2, adapter3],
      undefined,
    );

    expect(result).toStrictEqual({ success: true, data: 6 });
  });

  it("skips adapter that throws and continues cascade", async () => {
    const adapter1 = createMockAdapter<number>(() => 5);
    const adapter2 = createMockAdapter<number>(() => {
      throw new Error("fail");
    });
    const adapter3 = createMockAdapter<number>((prev) => (prev ?? 0) + 1);

    const result = await runAdaptersCascade<number>(
      [adapter1, adapter2, adapter3],
      undefined,
    );

    expect(result).toStrictEqual({ success: true, data: 6 });
  });

  it("returns error when all adapters fail", async () => {
    const adapter1 = createMockAdapter<string>(() => {
      throw new Error("fail 1");
    });
    const adapter2 = createMockAdapter<string>(() => {
      throw new Error("fail 2");
    });

    const result = await runAdaptersCascade<string>(
      [adapter1, adapter2],
      undefined,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("All adapters failed to initialize");
    }
  });

  it("returns error when all adapters return undefined", async () => {
    const adapter1 = createMockAdapter<string>(() => undefined);
    const adapter2 = createMockAdapter<string>(() => undefined);

    const result = await runAdaptersCascade<string>(
      [adapter1, adapter2],
      undefined,
    );

    expect(result.success).toBe(false);
  });

  it("works with async adapters", async () => {
    const adapter1 = createMockAdapter<number>(async () => {
      await Promise.resolve();
      return 10;
    });
    const adapter2 = createMockAdapter<number>(async (prev) => {
      await Promise.resolve();
      return (prev ?? 0) + 5;
    });

    const result = await runAdaptersCascade<number>(
      [adapter1, adapter2],
      undefined,
    );

    expect(result).toStrictEqual({ success: true, data: 15 });
  });

  it("uses initialState when provided", async () => {
    const adapter = createMockAdapter<number>((prev) => (prev ?? 0) + 1);

    const result = await runAdaptersCascade<number>([adapter], 100);

    expect(result).toStrictEqual({ success: true, data: 101 });
  });

  it("returns initialState when adapters return undefined but initialState exists", async () => {
    const adapter = createMockAdapter<number>(() => undefined);

    const result = await runAdaptersCascade<number>([adapter], 42);

    expect(result).toStrictEqual({ success: true, data: 42 });
  });
});

describe("createStore", () => {
  const createTestStore = <T, U>() =>
    createStore<T, U>({
      authManager: AuthManagerFactory({ storage: createMemoryStorage() }),
    });

  it("prevents infinite loops when adapters call change inside onChange", async () => {
    const store = createTestStore<number, number>();
    const onChangeCalls = { a: 0, b: 0 };

    const adapterA: Adapter<number> = {
      load: () => 42,
      onChange: () => {
        onChangeCalls.a++;
        adapterA.change?.(99);
      },
    };

    const adapterB: Adapter<number> = {
      load: () => undefined,
      onChange: () => {
        onChangeCalls.b++;
        adapterB.change?.(99);
      },
    };

    store.register(adapterA);
    store.register(adapterB);
    await store.init();

    // Both adapters get notified exactly once during init
    // Re-entrant change() calls are silently ignored
    expect(onChangeCalls.a).toBe(1);
    expect(onChangeCalls.b).toBe(1);
  });

  it("adapters still receive notifications after a guarded cycle", async () => {
    const store = createTestStore<number, number>();
    const onChangeCalls = { a: 0, b: 0 };

    const adapterA: Adapter<number> = {
      load: () => 42,
      onChange: () => {
        onChangeCalls.a++;
        adapterA.change?.(99);
      },
    };

    const adapterB: Adapter<number> = {
      load: () => undefined,
      onChange: () => {
        onChangeCalls.b++;
        adapterB.change?.(99);
      },
    };

    store.register(adapterA);
    store.register(adapterB);
    await store.init();

    // Reset counters
    onChangeCalls.a = 0;
    onChangeCalls.b = 0;

    // Subsequent updates still notify all adapters
    store.updateState(200);
    expect(onChangeCalls.a).toBe(1);
    expect(onChangeCalls.b).toBe(1);
  });
});
