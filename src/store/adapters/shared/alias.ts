/**
 * Shared alias utilities for remote adapters.
 *
 * The alias system provides privacy by ensuring users never see each other's
 * real userId. Instead, they see aliasIds that map to user info (name, avatar, etc.).
 *
 * Each remote adapter (Firebase, custom server, etc.) can use these utilities
 * to handle aliasing consistently.
 */

export type AliasId = string & { readonly __brand: "AliasId" };
export type UserId = string & { readonly __brand: "UserId" };

type UserInfo = {
  name: string;
  avatar?: string;
};

type AliasEntry = {
  aliasId: AliasId;
  userInfo: UserInfo;
};

export type AliasRegistry = Record<AliasId, UserInfo>;
export type AliasMappingRegistry = Record<UserId, AliasId>;

export const createAliasId = (id: string): AliasId => id as AliasId;

export const createUserId = (id: string): UserId => id as UserId;

/**
 * Generates a random alias ID.
 * Aliases are non-deterministic to prevent correlation attacks.
 */
export const generateRandomAlias = (): AliasId => {
  const randomPart = crypto.randomUUID().slice(0, 8);
  return createAliasId(`alias_${randomPart}`);
};

/**
 * Adds or updates an alias in the registry.
 */
export const setAlias = (
  registry: AliasRegistry,
  aliasId: AliasId,
  userInfo: UserInfo,
): AliasRegistry => ({
  ...registry,
  [aliasId]: userInfo,
});

/**
 * Removes an alias from the registry.
 */
export const removeAlias = (
  registry: AliasRegistry,
  aliasId: AliasId,
): AliasRegistry => {
  const { [aliasId]: _, ...rest } = registry;
  return rest;
};

/**
 * Gets user info for an alias, or undefined if not found.
 */
export const getAliasInfo = (
  registry: AliasRegistry,
  aliasId: AliasId,
): UserInfo | undefined => registry[aliasId];

/**
 * Checks if an alias exists in the registry.
 */
export const hasAlias = (registry: AliasRegistry, aliasId: AliasId): boolean =>
  aliasId in registry;

/**
 * Creates an empty alias registry.
 */
export const createEmptyAliasRegistry = (): AliasRegistry => ({});

/**
 * Merges two alias registries, with the second taking precedence.
 */
export const mergeAliasRegistries = (
  a: AliasRegistry,
  b: AliasRegistry,
): AliasRegistry => ({
  ...a,
  ...b,
});

/**
 * Gets all alias IDs in the registry.
 */
export const getAliasIds = (registry: AliasRegistry): AliasId[] =>
  Object.keys(registry) as AliasId[];

/**
 * Gets all alias entries in the registry.
 */
export const getAliasEntries = (registry: AliasRegistry): AliasEntry[] =>
  Object.entries(registry).map(([aliasId, userInfo]) => ({
    aliasId: aliasId as AliasId,
    userInfo,
  }));

/**
 * Adds a userId → aliasId mapping.
 */
export const addMapping = (
  mappings: AliasMappingRegistry,
  userId: UserId,
  aliasId: AliasId,
): AliasMappingRegistry => ({
  ...mappings,
  [userId]: aliasId,
});

/**
 * Gets the aliasId for a userId, or undefined if not mapped.
 */
export const getAliasForUser = (
  mappings: AliasMappingRegistry,
  userId: UserId,
): AliasId | undefined => mappings[userId];

/**
 * Gets the userId for an aliasId by searching the mappings.
 * Returns undefined if not found.
 */
export const getUserForAlias = (
  mappings: AliasMappingRegistry,
  aliasId: AliasId,
): UserId | undefined => {
  const entry = Object.entries(mappings).find(
    ([_, alias]) => alias === aliasId,
  );
  return entry ? (entry[0] as UserId) : undefined;
};

/**
 * Creates an empty mapping registry.
 */
export const createEmptyMappingRegistry = (): AliasMappingRegistry => ({});

/**
 * Replaces all userId references in an object with their aliasIds.
 * Useful for preparing data before sending to other users.
 *
 * Returns the object unchanged if no mapping exists for the userId.
 * Callers must ensure mappings are created before calling this function.
 *
 * @param obj - The object to transform
 * @param userIdField - The field name containing userId (e.g., "createdBy", "userId")
 * @param mappings - The userId → aliasId mappings
 */
export const replaceUserIdsWithAliases = <T extends Record<string, unknown>>(
  obj: T,
  userIdField: keyof T,
  mappings: AliasMappingRegistry,
): T => {
  const userId = obj[userIdField];
  if (typeof userId !== "string") {
    return obj;
  }

  const userIdTyped = createUserId(userId);
  const aliasId = getAliasForUser(mappings, userIdTyped);

  if (!aliasId) {
    return obj; // Keep userId if no mapping found
  }

  return {
    ...obj,
    [userIdField]: aliasId,
  };
};

export const getOrCreateAlias = (
  userId: UserId,
  mappings: AliasMappingRegistry,
): { aliasId: AliasId; mappings: AliasMappingRegistry } => {
  const currentAliasId = getAliasForUser(mappings, userId);
  const aliasId = generateRandomAlias();

  return currentAliasId
    ? { aliasId: currentAliasId, mappings }
    : {
        aliasId,
        mappings: addMapping(mappings, userId, aliasId),
      };
};
