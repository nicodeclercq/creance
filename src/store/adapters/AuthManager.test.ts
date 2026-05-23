import { describe, expect, it, vi } from "vitest";

import { AuthManagerFactory, type AuthState } from "./AuthManager";
import type { SecureKeyStore } from "../../service/secureKeyStore";

const createMockStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: () => null,
  };
};

const createMockSecureKeyStore = (): SecureKeyStore => {
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

vi.mock("../../service/crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../service/crypto")>();
  return {
    ...actual,
    generateKey: (password: string) =>
      Promise.resolve(`derived-key-from-${password}`),
  };
});

vi.mock("../../service/secureKeyStore", () => ({
  createSecureKeyStore: () => createMockSecureKeyStore(),
}));

describe("AuthManagerFactory", () => {
  it("initializes with 'initial' state when storage is empty", () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });

    expect(auth.getState()).toStrictEqual({ type: "initial" });
  });

  it("restores authenticated state from storage and secureKeyStore after init", async () => {
    const storage = createMockStorage();
    storage.setItem("creance-auth", JSON.stringify({ type: "authenticated" }));
    const secureKeyStore = createMockSecureKeyStore();
    await secureKeyStore.store("key123");

    const auth = AuthManagerFactory({ storage, secureKeyStore });
    expect(auth.getState()).toStrictEqual({ type: "initial" });

    await auth.init();

    expect(auth.getState()).toStrictEqual({
      type: "authenticated",
      userKey: "key123",
    });
  });

  it("falls back to initial when storage says authenticated but secureKeyStore has no key", async () => {
    const storage = createMockStorage();
    storage.setItem("creance-auth", JSON.stringify({ type: "authenticated" }));
    const secureKeyStore = createMockSecureKeyStore();

    const auth = AuthManagerFactory({ storage, secureKeyStore });
    await auth.init();

    expect(auth.getState()).toStrictEqual({ type: "initial" });
    expect(storage.getItem("creance-auth")).toBeNull();
  });

  it("restores anonymous state from storage after init", async () => {
    const storage = createMockStorage();
    storage.setItem("creance-auth", JSON.stringify({ type: "anonymous" }));

    const auth = AuthManagerFactory({
      storage,
      secureKeyStore: createMockSecureKeyStore(),
    });
    await auth.init();

    expect(auth.getState()).toStrictEqual({ type: "anonymous" });
  });

  it("falls back to initial on corrupted storage", async () => {
    const storage = createMockStorage();
    storage.setItem("creance-auth", "not-json");

    const auth = AuthManagerFactory({
      storage,
      secureKeyStore: createMockSecureKeyStore(),
    });
    await auth.init();

    expect(auth.getState()).toStrictEqual({ type: "initial" });
  });

  it("login with credentials sets authenticated state and stores key securely", async () => {
    const storage = createMockStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const auth = AuthManagerFactory({ storage, secureKeyStore });

    const result = await auth.login({ login: "user", password: "pass" });

    expect(result).toStrictEqual({
      type: "authenticated",
      userKey: "derived-key-from-pass",
    });
    expect(auth.getState()).toStrictEqual(result);
    expect(JSON.parse(storage.getItem("creance-auth")!)).toStrictEqual({
      type: "authenticated",
    });
    expect(await secureKeyStore.retrieve()).toBe("derived-key-from-pass");
  });

  it("login without credentials sets anonymous state", async () => {
    const storage = createMockStorage();
    const auth = AuthManagerFactory({
      storage,
      secureKeyStore: createMockSecureKeyStore(),
    });

    const result = await auth.login();

    expect(result).toStrictEqual({ type: "anonymous" });
    expect(auth.getState()).toStrictEqual({ type: "anonymous" });
    expect(JSON.parse(storage.getItem("creance-auth")!)).toStrictEqual({
      type: "anonymous",
    });
  });

  it("loginAdapter calls login function with cached credentials", async () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });
    const adapterLogin = vi.fn(() => Promise.resolve("uid-1"));

    await auth.login({ login: "user", password: "pass" });
    const result = await auth.loginAdapter(adapterLogin);

    expect(adapterLogin).toHaveBeenCalledWith({
      login: "user",
      password: "pass",
    });
    expect(result).toBe("uid-1");
  });

  it("loginAdapter returns undefined when no cached credentials", async () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });
    const adapterLogin = vi.fn();

    const result = await auth.loginAdapter(adapterLogin);

    expect(adapterLogin).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("logout resets state and removes from storage", async () => {
    const storage = createMockStorage();
    const secureKeyStore = createMockSecureKeyStore();
    const auth = AuthManagerFactory({ storage, secureKeyStore });

    await auth.login({ login: "user", password: "pass" });
    expect(auth.getState().type).toBe("authenticated");

    auth.logout();

    expect(auth.getState()).toStrictEqual({ type: "initial" });
    expect(storage.getItem("creance-auth")).toBeNull();
    expect(auth.getUserKey()).toBeUndefined();
  });

  it("logout clears cached credentials", async () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });
    const adapterLogin = vi.fn(() => Promise.resolve("uid-1"));

    await auth.login({ login: "user", password: "pass" });
    auth.logout();

    const result = await auth.loginAdapter(adapterLogin);

    expect(adapterLogin).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("getUserKey returns key when authenticated", async () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });

    expect(auth.getUserKey()).toBeUndefined();

    await auth.login({ login: "user", password: "pass" });

    expect(auth.getUserKey()).toBe("derived-key-from-pass");
  });

  it("stateSubject emits on state changes", async () => {
    const auth = AuthManagerFactory({
      storage: createMockStorage(),
      secureKeyStore: createMockSecureKeyStore(),
    });

    const emissions: AuthState[] = [];
    auth.stateSubject.subscribe((state) => emissions.push(state));

    await auth.login({ login: "user", password: "pass" });
    auth.logout();

    expect(emissions).toStrictEqual([
      { type: "initial" },
      { type: "authenticated", userKey: "derived-key-from-pass" },
      { type: "initial" },
    ]);
  });

  it("does not persist userKey to localStorage", async () => {
    const storage = createMockStorage();
    const auth = AuthManagerFactory({
      storage,
      secureKeyStore: createMockSecureKeyStore(),
    });

    await auth.login({ login: "user", password: "pass" });

    const stored = JSON.parse(storage.getItem("creance-auth")!);
    expect(stored).not.toHaveProperty("userKey");
    expect(stored).toStrictEqual({ type: "authenticated" });
  });
});
