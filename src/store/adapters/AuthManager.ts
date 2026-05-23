import * as z from "zod";

import { BehaviorSubject } from "rxjs";
import { generateKey } from "../../service/crypto";
import {
  type SecureKeyStore,
  createSecureKeyStore,
} from "../../service/secureKeyStore";

const AUTH_STORAGE_KEY = "creance-auth";

export type AuthState =
  | { type: "initial" }
  | { type: "authenticated"; userKey: string }
  | { type: "anonymous" };

type CachedCredentials = {
  login: string;
  password: string;
  userKey: string;
};

export type Credentials = {
  login: string;
  password: string;
};

type AdapterLogin = (credentials: Credentials) => Promise<string | Error>;

export type AuthManager = {
  stateSubject: BehaviorSubject<AuthState>;
  getState: () => AuthState;
  getUserKey: () => string | undefined;
  login: (credentials?: Credentials) => Promise<AuthState>;
  loginAdapter: (
    loginFn: AdapterLogin,
  ) => ReturnType<AdapterLogin> | Promise<undefined>;
  logout: () => void;
  init: () => Promise<void>;
};

const storedAuthSchema = z.union([
  z.strictObject({
    type: z.literal("anonymous"),
  }),
  z.strictObject({
    type: z.literal("authenticated"),
  }),
]);

const readAuthTypeFromStorage = (
  storage: Storage,
  key: string,
): "authenticated" | "anonymous" | "initial" => {
  const stored = storage.getItem(key);
  if (!stored) {
    return "initial";
  }

  try {
    const parsed = storedAuthSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data.type : "initial";
  } catch {
    return "initial";
  }
};

export const AuthManagerFactory = ({
  storage = localStorage,
  key = AUTH_STORAGE_KEY,
  secureKeyStore = createSecureKeyStore(),
}: {
  storage?: Storage;
  key?: string;
  secureKeyStore?: SecureKeyStore;
  credentialsTTL?: number;
}): AuthManager => {
  const stateSubject = new BehaviorSubject<AuthState>({ type: "initial" });

  const cachedCredentials = new BehaviorSubject<CachedCredentials | undefined>(
    undefined,
  );

  const persist = (auth: AuthState): void => {
    auth.type === "initial"
      ? storage.removeItem(key)
      : storage.setItem(key, JSON.stringify({ type: auth.type }));
  };

  const setState = (auth: AuthState): AuthState => {
    persist(auth);
    stateSubject.next(auth);

    return auth;
  };

  const init = (): Promise<void> => {
    const storedType = readAuthTypeFromStorage(storage, key);

    if (storedType === "authenticated") {
      return secureKeyStore.retrieve().then((userKey) => {
        stateSubject.next(
          userKey != null
            ? { type: "authenticated", userKey }
            : { type: "initial" },
        );
        if (userKey == null) {
          storage.removeItem(key);
        }
      });
    }

    stateSubject.next(
      storedType === "anonymous" ? { type: "anonymous" } : { type: "initial" },
    );
    return Promise.resolve();
  };

  const login = (credentials?: Credentials): Promise<AuthState> => {
    if (credentials == null) {
      return secureKeyStore.clear().then(() => setState({ type: "anonymous" }));
    }

    return generateKey(credentials.password).then((userKey) => {
      cachedCredentials.next({
        login: credentials.login,
        password: credentials.password,
        userKey,
      });

      return secureKeyStore
        .store(userKey)
        .then(() => setState({ type: "authenticated", userKey }));
    });
  };

  const logout = (): void => {
    cachedCredentials.next(undefined);
    secureKeyStore.clear().catch(() => {});
    setState({ type: "initial" });
  };

  const loginAdapter = (loginFn: AdapterLogin) => {
    const cached = cachedCredentials.value;

    return cached != null
      ? loginFn({ login: cached.login, password: cached.password })
      : Promise.resolve(undefined);
  };

  return {
    stateSubject,
    getState: () => stateSubject.getValue(),
    getUserKey: () => {
      const s = stateSubject.getValue();
      return s.type === "authenticated" ? s.userKey : undefined;
    },
    loginAdapter,
    login,
    logout,
    init,
  };
};

// Singleton default AuthManager used in app
let defaultAuthManager: AuthManager | undefined;
export const getDefaultAuthManager = (): AuthManager => {
  if (defaultAuthManager == null) {
    defaultAuthManager = AuthManagerFactory({});
  }

  return defaultAuthManager;
};
