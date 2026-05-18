import { BehaviorSubject, NEVER, map } from "rxjs";
import { describe, expect, it, vi } from "vitest";

import type { AuthManager, AuthState, Credentials } from "./AuthManager";
import { createUserId, type UserId } from "./shared/alias";
import { createRemoteAdapter } from "./createRemoteAdapter";
import { createTestState } from "../__tests__/builders";
import { createEvent } from "../../service/test-helpers";

vi.mock("./shared/e2ee", () => ({
  encryptState: (state: unknown) => Promise.resolve(JSON.stringify(state)),
  decryptState: (encrypted: string) => Promise.resolve(JSON.parse(encrypted)),
}));

const createFakeAuthManager = (
  authState: AuthState = { type: "authenticated", userKey: "user-key" },
): AuthManager => {
  const stateSubject = new BehaviorSubject<AuthState>(authState);

  const getAuthenticatedState = (): AuthState => {
    const state = stateSubject.value;
    return state.type === "authenticated"
      ? state
      : { type: "authenticated", userKey: "user-key" };
  };

  return {
    stateSubject,
    getState: () => stateSubject.value,
    getUserKey: () =>
      stateSubject.value.type === "authenticated"
        ? stateSubject.value.userKey
        : undefined,
    login: (_credentials?: Credentials) => {
      const nextState = getAuthenticatedState();
      stateSubject.next(nextState);
      return Promise.resolve(nextState);
    },
    loginAdapter: (_loginFn) => Promise.resolve(createUserId("user-1")),
    logout: () => {
      stateSubject.next({ type: "initial" });
    },
    init: () => Promise.resolve(),
  };
};

const createFakeAdapter = () => {
  const userData = new BehaviorSubject<string | undefined>(undefined);
  const events = new BehaviorSubject<Record<string, string>>({});
  const userId = "1" as UserId;
  const authManager = createFakeAuthManager();
  const remoteAdapter = createRemoteAdapter({
    operations: {
      login: () => Promise.resolve(userId),
      logout: () => Promise.resolve(),
      signup: () => Promise.resolve(userId),
      getUserData: () => userData,
      name: "test",
      setUserData: (data: string) => {
        userData.next(data);
        return Promise.resolve();
      },
      deleteEventData: (eventId) => {
        const { [eventId]: current, ...others } = events.value;
        events.next(others);
        return Promise.resolve();
      },
      getEventData: (eventId) => {
        return events.asObservable().pipe(map((events) => events[eventId]));
      },
      setEventData: (eventId, data) => {
        events.next({
          ...events.value,
          [eventId]: data,
        });
        return Promise.resolve();
      },
    },
    authManager,
  });

  return {
    remoteAdapter,
    setEventData: (eventId: string, data: string) => {
      events.next({
        ...events.value,
        [eventId]: data,
      });
    },
  };
};

describe("createRemoteAdapter", () => {
  it("can save and fetch data afterward", async () => {
    const { remoteAdapter } = createFakeAdapter();
    const state = createTestState();

    remoteAdapter.onChange(state);

    await vi.waitFor(async () => {
      const loadedState = await remoteAdapter.load(undefined);
      expect(loadedState).toStrictEqual(state);
    });
  });

  it("can fetch item from remote event data", async () => {
    const { remoteAdapter, setEventData } = createFakeAdapter();
    const event = createEvent({ _id: "evt-1", name: "Fetched Event" });
    setEventData(
      event._id,
      JSON.stringify({
        event,
        participants: {
          "user-1": {
            aliasId: "alias-1",
            userInfo: {
              name: "Test User",
            },
          },
        },
        updatedAt: event.updatedAt,
      }),
    );

    const fetchedEvent = await remoteAdapter.fetchItem(event._id, "event-key");

    expect(fetchedEvent).toStrictEqual(event);
  });

  it("falls back to previous state when first remote emission never arrives", async () => {
    vi.useFakeTimers();
    const userId = "1" as UserId;
    const previous = createTestState();
    const authManager = createFakeAuthManager();
    const remoteAdapter = createRemoteAdapter({
      operations: {
        login: () => Promise.resolve(userId),
        logout: () => Promise.resolve(),
        signup: () => Promise.resolve(userId),
        getUserData: () => NEVER,
        name: "test-timeout",
        setUserData: () => Promise.resolve(),
      },
      authManager,
    });

    const loadedStatePromise = remoteAdapter.load(previous);
    await vi.advanceTimersByTimeAsync(3001);
    const loadedState = await loadedStatePromise;
    expect(loadedState).toStrictEqual(previous);
    vi.useRealTimers();
  });
});
