import { describe, it, expect } from "vitest";

import {
  createAliasId,
  createUserId,
  generateRandomAlias,
  setAlias,
  removeAlias,
  getAliasInfo,
  hasAlias,
  createEmptyAliasRegistry,
  mergeAliasRegistries,
  getAliasIds,
  getAliasEntries,
  addMapping,
  getAliasForUser,
  getUserForAlias,
  createEmptyMappingRegistry,
  replaceUserIdsWithAliases,
  type AliasRegistry,
  type AliasMappingRegistry,
} from "./alias";

describe("Alias constructors", () => {
  it("creates an AliasId", () => {
    const aliasId = createAliasId("alias_123");
    expect(aliasId).toBe("alias_123");
  });

  it("creates a UserId", () => {
    const userId = createUserId("user_456");
    expect(userId).toBe("user_456");
  });
});

describe("generateRandomAlias", () => {
  it("generates alias with prefix", () => {
    const alias = generateRandomAlias();

    expect(alias).toMatch(/^alias_/);
  });

  it("generates different aliases on each call", () => {
    const alias1 = generateRandomAlias();
    const alias2 = generateRandomAlias();

    expect(alias1).not.toBe(alias2);
  });

  it("generates aliases with expected format", () => {
    const alias = generateRandomAlias();

    // Format: alias_ + 8 chars from UUID
    expect(alias).toMatch(/^alias_[a-f0-9]{8}$/);
  });
});

describe("AliasRegistry operations", () => {
  const aliasId1 = createAliasId("alias_1");
  const aliasId2 = createAliasId("alias_2");
  const userInfo1 = { name: "Alice", avatar: "avatar1.png" };
  const userInfo2 = { name: "Bob" };

  describe("setAlias", () => {
    it("adds a new alias to empty registry", () => {
      const registry = createEmptyAliasRegistry();
      const result = setAlias(registry, aliasId1, userInfo1);

      expect(result[aliasId1]).toEqual(userInfo1);
    });

    it("adds a new alias to existing registry", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      const result = setAlias(registry, aliasId2, userInfo2);

      expect(result[aliasId1]).toEqual(userInfo1);
      expect(result[aliasId2]).toEqual(userInfo2);
    });

    it("updates existing alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      const updatedInfo = { name: "Alice Updated", avatar: "new.png" };
      const result = setAlias(registry, aliasId1, updatedInfo);

      expect(result[aliasId1]).toEqual(updatedInfo);
    });

    it("does not mutate original registry", () => {
      const registry = createEmptyAliasRegistry();
      setAlias(registry, aliasId1, userInfo1);

      expect(registry).toEqual({});
    });
  });

  describe("removeAlias", () => {
    it("removes existing alias", () => {
      const registry: AliasRegistry = {
        [aliasId1]: userInfo1,
        [aliasId2]: userInfo2,
      };
      const result = removeAlias(registry, aliasId1);

      expect(result[aliasId1]).toBeUndefined();
      expect(result[aliasId2]).toEqual(userInfo2);
    });

    it("returns same structure when removing non-existent alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      const result = removeAlias(registry, aliasId2);

      expect(result).toEqual(registry);
    });

    it("does not mutate original registry", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      removeAlias(registry, aliasId1);

      expect(registry[aliasId1]).toEqual(userInfo1);
    });
  });

  describe("getAliasInfo", () => {
    it("returns user info for existing alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      const result = getAliasInfo(registry, aliasId1);

      expect(result).toEqual(userInfo1);
    });

    it("returns undefined for non-existent alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };
      const result = getAliasInfo(registry, aliasId2);

      expect(result).toBeUndefined();
    });
  });

  describe("hasAlias", () => {
    it("returns true for existing alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };

      expect(hasAlias(registry, aliasId1)).toBe(true);
    });

    it("returns false for non-existent alias", () => {
      const registry: AliasRegistry = { [aliasId1]: userInfo1 };

      expect(hasAlias(registry, aliasId2)).toBe(false);
    });
  });

  describe("mergeAliasRegistries", () => {
    it("merges two registries", () => {
      const registryA: AliasRegistry = { [aliasId1]: userInfo1 };
      const registryB: AliasRegistry = { [aliasId2]: userInfo2 };
      const result = mergeAliasRegistries(registryA, registryB);

      expect(result[aliasId1]).toEqual(userInfo1);
      expect(result[aliasId2]).toEqual(userInfo2);
    });

    it("second registry takes precedence for conflicts", () => {
      const registryA: AliasRegistry = { [aliasId1]: userInfo1 };
      const registryB: AliasRegistry = { [aliasId1]: userInfo2 };
      const result = mergeAliasRegistries(registryA, registryB);

      expect(result[aliasId1]).toEqual(userInfo2);
    });
  });

  describe("getAliasIds", () => {
    it("returns all alias IDs", () => {
      const registry: AliasRegistry = {
        [aliasId1]: userInfo1,
        [aliasId2]: userInfo2,
      };
      const result = getAliasIds(registry);

      expect(result).toContain(aliasId1);
      expect(result).toContain(aliasId2);
      expect(result).toHaveLength(2);
    });

    it("returns empty array for empty registry", () => {
      const result = getAliasIds(createEmptyAliasRegistry());

      expect(result).toEqual([]);
    });
  });

  describe("getAliasEntries", () => {
    it("returns all entries", () => {
      const registry: AliasRegistry = {
        [aliasId1]: userInfo1,
        [aliasId2]: userInfo2,
      };
      const result = getAliasEntries(registry);

      expect(result).toContainEqual({ aliasId: aliasId1, userInfo: userInfo1 });
      expect(result).toContainEqual({ aliasId: aliasId2, userInfo: userInfo2 });
      expect(result).toHaveLength(2);
    });
  });
});

describe("AliasMappingRegistry operations", () => {
  const userId1 = createUserId("user_1");
  const userId2 = createUserId("user_2");
  const aliasId1 = createAliasId("alias_1");
  const aliasId2 = createAliasId("alias_2");

  describe("addMapping", () => {
    it("adds a new mapping", () => {
      const mappings = createEmptyMappingRegistry();
      const result = addMapping(mappings, userId1, aliasId1);

      expect(result[userId1]).toBe(aliasId1);
    });

    it("does not mutate original", () => {
      const mappings = createEmptyMappingRegistry();
      addMapping(mappings, userId1, aliasId1);

      expect(mappings).toEqual({});
    });
  });

  describe("getAliasForUser", () => {
    it("returns alias for existing user", () => {
      const mappings: AliasMappingRegistry = { [userId1]: aliasId1 };
      const result = getAliasForUser(mappings, userId1);

      expect(result).toBe(aliasId1);
    });

    it("returns undefined for non-existent user", () => {
      const mappings: AliasMappingRegistry = { [userId1]: aliasId1 };
      const result = getAliasForUser(mappings, userId2);

      expect(result).toBeUndefined();
    });
  });

  describe("getUserForAlias", () => {
    it("returns user for existing alias", () => {
      const mappings: AliasMappingRegistry = { [userId1]: aliasId1 };
      const result = getUserForAlias(mappings, aliasId1);

      expect(result).toBe(userId1);
    });

    it("returns undefined for non-existent alias", () => {
      const mappings: AliasMappingRegistry = { [userId1]: aliasId1 };
      const result = getUserForAlias(mappings, aliasId2);

      expect(result).toBeUndefined();
    });
  });
});

describe("Transformation functions", () => {
  const userId1 = createUserId("user_1");
  const aliasId1 = createAliasId("alias_1");
  const mappings: AliasMappingRegistry = { [userId1]: aliasId1 };

  describe("replaceUserIdsWithAliases", () => {
    it("replaces userId with existing alias", () => {
      const obj = { id: "1", createdBy: "user_1", amount: 100 };
      const result = replaceUserIdsWithAliases(obj, "createdBy", mappings);

      expect(result.createdBy).toBe(aliasId1);
      expect(result.id).toBe("1");
      expect(result.amount).toBe(100);
    });

    it("keeps userId when no mapping exists", () => {
      const obj = { id: "1", createdBy: "unknown_user", amount: 100 };
      const result = replaceUserIdsWithAliases(obj, "createdBy", mappings);

      // Without a mapping, the userId is kept unchanged
      expect(result.createdBy).toBe("unknown_user");
    });

    it("returns unchanged if field is not a string", () => {
      const obj = { id: "1", createdBy: null, amount: 100 };
      const result = replaceUserIdsWithAliases(
        obj as Record<string, unknown>,
        "createdBy",
        mappings
      );

      expect(result.createdBy).toBeNull();
    });

    it("does not mutate original", () => {
      const obj = { id: "1", createdBy: "user_1", amount: 100 };
      replaceUserIdsWithAliases(obj, "createdBy", mappings);

      expect(obj.createdBy).toBe("user_1");
    });
  });

});
