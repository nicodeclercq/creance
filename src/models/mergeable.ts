import * as z from "zod";

export const PAST_DATE = new Date("2025-01-01");

export const updatedAtSchema = z.union([
  z.string().transform((date) => new Date(date)),
  z.date(),
]);

export const mergeableRecord = <Shape extends z.core.$ZodLooseShape>(
  shape: Shape,
) =>
  z.strictObject({
    ...shape,
    updatedAt: updatedAtSchema,
  });

export type MergeableRecord<T> = T & {
  updatedAt: Date;
};

export const mergeableCollection = <Schema extends z.ZodTypeAny>(
  schema: Schema,
) =>
  z.strictObject({
    collection: z.record(z.string(), schema),
    updatedAt: updatedAtSchema,
  });

export type MergeableCollection<T> = {
  collection: Record<string, MergeableRecord<T>>;
  updatedAt: Date;
};

type MergeableState<T extends Record<string, unknown>> = {
  [k in keyof T]: T[k] extends Record<string, unknown>
    ? MergeableState<T[k]>
    : T[k];
} & {
  updatedAt: Date;
};

export const createEmptyMergeableCollection = <
  T,
>(): MergeableCollection<T> => ({
  collection: {} as Record<string, MergeableRecord<T>>,
  updatedAt: PAST_DATE,
});

export const createMergeableRecord = <T>(record: T): MergeableRecord<T> =>
  ({
    ...record,
    updatedAt: PAST_DATE,
  }) as MergeableRecord<T>;

export const updateMergeableRecord = <T>(
  record: MergeableRecord<T>,
  now: Date = new Date(),
): MergeableRecord<T> => ({
  ...record,
  updatedAt: now,
});

export function updateMergeableCollection<T extends { _id: string }>(
  items: MergeableRecord<T>[],
  now: Date = new Date(),
): MergeableCollection<T> {
  return {
    collection: items.reduce(
      (acc, item) => ({
        ...acc,
        [item._id]: {
          ...item,
          updatedAt: now,
        },
      }),
      {} as Record<string, MergeableRecord<T>>,
    ),
    updatedAt: now,
  };
}

export function updateMergeableCollectionItem<T>(
  key: string,
  item: NoInfer<T>,
  collection: MergeableCollection<T>,
  now: Date = new Date(),
): MergeableCollection<T> {
  return {
    collection: {
      ...collection.collection,
      [key]: {
        ...item,
        updatedAt: now,
      } as MergeableRecord<T>,
    },
    updatedAt: now,
  };
}

export const addMergeableCollectionItem = <T>(
  key: string,
  item: Omit<T, "updatedAt">,
  collection: MergeableCollection<T>,
  now: Date = new Date(),
): MergeableCollection<T> => ({
  collection: {
    ...collection.collection,
    [key]: {
      ...item,
      updatedAt: PAST_DATE,
    } as MergeableRecord<T>,
  },
  updatedAt: now,
});

export const deleteMergeableCollectionItem = <T>(
  key: string,
  { collection }: MergeableCollection<T>,
  now: Date = new Date(),
): MergeableCollection<T> => {
  const { [key]: _, ...rest } = collection;

  return {
    collection: rest as Record<string, MergeableRecord<T>>,
    updatedAt: now,
  };
};
