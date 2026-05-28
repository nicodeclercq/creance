export type CompareResult = -1 | 0 | 1;

export const compareTimestamps = (a: Date, b: Date): CompareResult => {
  const diff = a.getTime() - b.getTime();
  if (Math.abs(diff) < 1) return 0;
  return diff > 0 ? 1 : -1;
};

export type Timestamped = {
  updatedAt: Date;
};

export type Collection<T extends Timestamped> = {
  collection: Record<string, T>;
  updatedAt: Date;
};

const isTimestamped = (value: unknown): value is Timestamped =>
  typeof value === "object" &&
  value !== null &&
  "updatedAt" in value &&
  (value.updatedAt instanceof Date || typeof value.updatedAt === "string");

const isCollection = (value: unknown): value is Collection<Timestamped> =>
  typeof value === "object" &&
  value !== null &&
  "collection" in value &&
  "updatedAt" in value &&
  typeof value.collection === "object" &&
  value.updatedAt instanceof Date;

const mergeCollection = <T extends Timestamped>(
  a: Collection<T>,
  b: Collection<T>
): Collection<T> => {
  const comparison = compareTimestamps(a.updatedAt, b.updatedAt);
  const winnerCollection = comparison === 1 ? a : b;

  const allKeys = [
    ...new Set([...Object.keys(a.collection), ...Object.keys(b.collection)]),
  ];

  const mergedCollection = allKeys.reduce<Record<string, T>>((result, key) => {
    const itemA = a.collection[key];
    const itemB = b.collection[key];

    if (itemA !== undefined && itemB !== undefined) {
      return { ...result, [key]: merge(itemA, itemB) };
    }
    return itemA !== undefined
      ? { ...result, [key]: itemA }
      : itemB !== undefined
        ? { ...result, [key]: itemB }
        : result;
  }, {});

  return {
    collection: mergedCollection,
    updatedAt: winnerCollection.updatedAt,
  };
};

export const merge = <T extends Timestamped>(a: T, b: T): T => {
  const comparison = compareTimestamps(a.updatedAt, b.updatedAt);
  const winner = comparison === 1 ? a : b;

  const mergedFields = Object.keys(a).reduce<Record<string, unknown>>(
    (acc, key) => {
      if (key === "updatedAt") return acc;

      const valueA = a[key as keyof T];
      const valueB = b[key as keyof T];

      if (isCollection(valueA) && isCollection(valueB)) {
        return { ...acc, [key]: mergeCollection(valueA, valueB) };
      }
      if (isTimestamped(valueA) && isTimestamped(valueB)) {
        return { ...acc, [key]: merge(valueA, valueB) };
      }
      return acc;
    },
    {}
  );

  return {
    ...winner,
    ...mergedFields,
  };
};
