import { describe, expect, it, vi } from "vitest";
import { firstValueFrom } from "rxjs";

import type { RemoteOperations } from "../adapters/createRemoteAdapter";
import { createInMemoryBackend } from "./createInMemoryBackend";

type OperationsFactory = {
  name: string;
  create: () => RemoteOperations;
};

const TEST_CREDENTIALS = { login: "test", password: "test" };

const factories: OperationsFactory[] = [
  {
    name: "InMemoryBackend",
    create: () => createInMemoryBackend().operations,
  },
];

const describeContract = ({ name, create }: OperationsFactory) => {
  describe(`RemoteOperations contract: ${name}`, () => {
    // --- Auth ---

    it("login resolves with a UserId (not an Error)", async () => {
      const ops = create();
      const result = await ops.login(TEST_CREDENTIALS);
      expect(result).not.toBeInstanceOf(Error);
      expect(typeof result).toBe("string");
    });

    it("signup resolves with a UserId (not an Error)", async () => {
      const ops = create();
      const result = await ops.signup(TEST_CREDENTIALS);
      expect(result).not.toBeInstanceOf(Error);
      expect(typeof result).toBe("string");
    });

    it("logout resolves without throwing", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);
      await expect(ops.logout()).resolves.toBeUndefined();
    });

    // --- User data ---

    it("getUserData emits undefined when no data exists", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);
      const value = await firstValueFrom(ops.getUserData());
      expect(value).toBeUndefined();
    });

    it("setUserData then getUserData returns the written value", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);
      await ops.setUserData("encrypted-payload");

      const value = await firstValueFrom(ops.getUserData());
      expect(value).toBe("encrypted-payload");
    });

    it("getUserData observable emits on subsequent writes", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      const values: (string | undefined)[] = [];
      const sub = ops.getUserData().subscribe((v) => values.push(v));

      await vi.waitFor(() => {
        expect(values.length).toBeGreaterThanOrEqual(1);
      });

      await ops.setUserData("payload-1");

      await vi.waitFor(() => {
        expect(values).toContain("payload-1");
      });

      sub.unsubscribe();
    });

    it("setUserData overwrites previous value", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      await ops.setUserData("first");
      await ops.setUserData("second");

      const value = await firstValueFrom(ops.getUserData());
      expect(value).toBe("second");
    });

    // --- Event data ---

    it("getEventData emits undefined when no data exists", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      const value = await firstValueFrom(ops.getEventData!("evt-1"));
      expect(value).toBeUndefined();
    });

    it("setEventData then getEventData returns the written value", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      await ops.setEventData!("evt-1", "event-encrypted");

      const value = await firstValueFrom(ops.getEventData!("evt-1"));
      expect(value).toBe("event-encrypted");
    });

    it("event data is isolated per eventId", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      await ops.setEventData!("evt-a", "data-a");
      await ops.setEventData!("evt-b", "data-b");

      const valueA = await firstValueFrom(ops.getEventData!("evt-a"));
      const valueB = await firstValueFrom(ops.getEventData!("evt-b"));

      expect(valueA).toBe("data-a");
      expect(valueB).toBe("data-b");
    });

    it("deleteEventData makes subsequent reads return undefined", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      await ops.setEventData!("evt-1", "event-data");
      await ops.deleteEventData!("evt-1");

      const value = await firstValueFrom(ops.getEventData!("evt-1"));
      expect(value).toBeUndefined();
    });

    it("deleteEventData does not affect other events", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      await ops.setEventData!("evt-a", "data-a");
      await ops.setEventData!("evt-b", "data-b");
      await ops.deleteEventData!("evt-a");

      const valueA = await firstValueFrom(ops.getEventData!("evt-a"));
      const valueB = await firstValueFrom(ops.getEventData!("evt-b"));

      expect(valueA).toBeUndefined();
      expect(valueB).toBe("data-b");
    });

    // --- Subscription lifecycle ---

    it("unsubscribing from getUserData stops receiving updates", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      const values: (string | undefined)[] = [];
      const sub = ops.getUserData().subscribe((v) => values.push(v));

      await vi.waitFor(() => {
        expect(values.length).toBeGreaterThanOrEqual(1);
      });

      sub.unsubscribe();
      const countAfterUnsub = values.length;

      await ops.setUserData("after-unsub");

      // Give time for any spurious emission
      await new Promise((r) => setTimeout(r, 50));
      expect(values.length).toBe(countAfterUnsub);
    });

    it("getEventData observable emits on writes", async () => {
      const ops = create();
      await ops.login(TEST_CREDENTIALS);

      const values: (string | undefined)[] = [];
      const sub = ops.getEventData!("evt-1").subscribe((v) => values.push(v));

      await vi.waitFor(() => {
        expect(values.length).toBeGreaterThanOrEqual(1);
      });

      await ops.setEventData!("evt-1", "updated");

      await vi.waitFor(() => {
        expect(values).toContain("updated");
      });

      sub.unsubscribe();
    });
  });
};

factories.forEach(describeContract);
