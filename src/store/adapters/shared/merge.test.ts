import { describe, it, expect } from "vitest";

import { merge, type Timestamped, type Collection } from "./merge";

const date = (str: string) => new Date(str);
const d1 = date("2026-01-01T00:00:00Z");
const d2 = date("2026-01-02T00:00:00Z");

describe("merge", () => {
  it("returns object with newer timestamp for simple objects", () => {
    const a = { name: "Albert", updatedAt: d2 };
    const b = { name: "Robert", updatedAt: d1 };

    expect(merge(a, b)).toEqual({
      name: "Albert",
      updatedAt: d2,
    });
  });

  it("prefers second object when timestamps are equal (remote wins)", () => {
    const a = { name: "Local", updatedAt: d1 };
    const b = { name: "Remote", updatedAt: d1 };

    expect(merge(a, b).name).toBe("Remote");
  });

  it("merges nested collections and excludes items only in older collection", () => {
    type Color = Timestamped & { name: string };
    type ObjectWithColors = Timestamped & { name: string; colors: Collection<Color> };

    const a: ObjectWithColors = {
      name: "Albert",
      colors: {
        collection: {
          red: { name: "red", updatedAt: d1 },
        },
        updatedAt: d2,
      },
      updatedAt: d1,
    };
    const b: ObjectWithColors = {
      name: "Albert",
      colors: {
        collection: {
          red: { name: "orange", updatedAt: d2 },
          blue: { name: "blue", updatedAt: d2 },
        },
        updatedAt: d1,
      },
      updatedAt: d1,
    };

    const result = merge(a, b);

    expect(result.name).toBe("Albert");
    expect(result.colors.collection["red"].name).toBe("orange");
    expect(result.colors.collection["blue"]).toBeUndefined();
    expect(result.colors.updatedAt).toEqual(d2);
  });

  it("includes items only in newer collection", () => {
    type Item = Timestamped & { value: string };
    type Parent = Timestamped & { items: Collection<Item> };

    const a: Parent = {
      items: {
        collection: {
          "1": { value: "from-a", updatedAt: d1 },
        },
        updatedAt: d2,
      },
      updatedAt: d1,
    };
    const b: Parent = {
      items: {
        collection: {},
        updatedAt: d1,
      },
      updatedAt: d1,
    };

    const result = merge(a, b);

    expect(result.items.collection["1"].value).toBe("from-a");
  });

  it("merges items present in both collections by their own timestamp", () => {
    type Item = Timestamped & { value: string };
    type Parent = Timestamped & { items: Collection<Item> };

    const a: Parent = {
      items: {
        collection: {
          "1": { value: "a-older", updatedAt: d1 },
          "2": { value: "a-newer", updatedAt: d2 },
        },
        updatedAt: d1,
      },
      updatedAt: d1,
    };
    const b: Parent = {
      items: {
        collection: {
          "1": { value: "b-newer", updatedAt: d2 },
          "2": { value: "b-older", updatedAt: d1 },
        },
        updatedAt: d2,
      },
      updatedAt: d2,
    };

    const result = merge(a, b);

    expect(result.items.collection["1"].value).toBe("b-newer");
    expect(result.items.collection["2"].value).toBe("a-newer");
  });

  it("handles deeply nested collections", () => {
    type Leaf = Timestamped & { data: string };
    type Middle = Timestamped & { leaves: Collection<Leaf> };
    type Root = Timestamped & { middles: Collection<Middle> };

    const a: Root = {
      middles: {
        collection: {
          m1: {
            leaves: {
              collection: {
                l1: { data: "a-newer", updatedAt: d2 },
              },
              updatedAt: d1,
            },
            updatedAt: d1,
          },
        },
        updatedAt: d1,
      },
      updatedAt: d1,
    };
    const b: Root = {
      middles: {
        collection: {
          m1: {
            leaves: {
              collection: {
                l1: { data: "b-older", updatedAt: d1 },
                l2: { data: "b-only", updatedAt: d1 },
              },
              updatedAt: d2,
            },
            updatedAt: d2,
          },
        },
        updatedAt: d2,
      },
      updatedAt: d2,
    };

    const result = merge(a, b);

    expect(result.middles.collection["m1"].leaves.collection["l1"].data).toBe("a-newer");
    expect(result.middles.collection["m1"].leaves.collection["l2"].data).toBe("b-only");
  });

  it("merges nested timestamped objects (not collections)", () => {
    type Profile = Timestamped & { bio: string };
    type User = Timestamped & { name: string; profile: Profile };

    const a: User = {
      name: "old-name",
      profile: { bio: "a-newer-bio", updatedAt: d2 },
      updatedAt: d1,
    };
    const b: User = {
      name: "new-name",
      profile: { bio: "b-older-bio", updatedAt: d1 },
      updatedAt: d2,
    };

    const result = merge(a, b);

    expect(result.name).toBe("new-name");
    expect(result.profile.bio).toBe("a-newer-bio");
  });
});
