import * as RX from "rxjs";
import { type Observable } from "rxjs";
import * as z from "zod";

type Diff<Data> = {
  created: Record<string, Data>;
  unchanged: Record<string, Data>;
  updated: Record<string, Data>;
  deleted: Record<string, Data>;
};

type MergeDiff<Data> = {
  local: Diff<Data>;
  remote: Diff<Data>;
};

export const lastUpdate = {
  get: (collectionName: string) => {
    const model = z
      .string()
      .nullable()
      .transform((val) =>
        val == null ? new Date("2025-01-01") : new Date(val)
      );
    const lastUpdate = localStorage.getItem(`lastUpdate_${collectionName}`);
    const parsed = model.safeParse(lastUpdate);
    if (!parsed.success) {
      console.error(
        "Failed to parse lastUpdate from localStorage, returning current date.",
        parsed.error
      );
      return new Date();
    }

    return parsed.data;
  },
  update: (collectionName: string) => {
    localStorage.setItem(
      `lastUpdate_${collectionName}`,
      new Date().toISOString()
    );
  },
};

export function getMergeDiffs<Data extends { updatedAt: Date }>({
  local,
  remote,
  lastUpdateDate,
}: {
  local: Record<string, Data>;
  remote: Record<string, Data>;
  lastUpdateDate: Date;
}): MergeDiff<Data> {
  const keys = [...new Set([...Object.keys(local), ...Object.keys(remote)])];
  const diffs: MergeDiff<Data> = {
    local: {
      created: {},
      unchanged: {},
      updated: {},
      deleted: {},
    },
    remote: {
      created: {},
      unchanged: {},
      updated: {},
      deleted: {},
    },
  };
  // forEach key
  //  if in local but not in remote
  //    if updatedAt > lastUpdateDate, add to remote
  //    if updatedAt <= lastUpdateDate, delete from remote
  //  if in remote but not in local
  //    if updatedAt > lastUpdateDate, add to local
  //    if updatedAt <= lastUpdateDate, delete from local
  //  if in both
  //    if local.updatedAt = remote.updatedAt, unchanged
  //    if local.updatedAt < remote.updatedAt, update local
  //    if local.updatedAt > remote.updatedAt, updated remote
  keys.forEach((key) => {
    const localData = local[key];
    const remoteData = remote[key];

    if (localData && !remoteData) {
      // in local but not in remote
      if (localData.updatedAt > lastUpdateDate) {
        diffs.remote.created[key] = localData;
        diffs.local.unchanged[key] = localData;
      } else {
        diffs.local.deleted[key] = localData;
      }
    } else if (!localData && remoteData) {
      // in remote but not in local
      if (remoteData.updatedAt > lastUpdateDate) {
        diffs.local.created[key] = remoteData;
        diffs.remote.unchanged[key] = remoteData;
      } else {
        diffs.remote.deleted[key] = remoteData;
      }
    } else if (localData && remoteData) {
      // in both
      if (localData.updatedAt === remoteData.updatedAt) {
        diffs.local.unchanged[key] = localData;
        diffs.remote.unchanged[key] = remoteData;
      } else if (localData.updatedAt > remoteData.updatedAt) {
        diffs.remote.updated[key] = localData;
        diffs.local.unchanged[key] = localData;
      } else {
        diffs.local.updated[key] = remoteData;
        diffs.remote.unchanged[key] = remoteData;
      }
    }
  });

  return diffs;
}

export function synchronize<Data extends { updatedAt: Date }>({
  collectionName,
  local,
  remote,
  saveLocal,
  saveRemote,
}: {
  collectionName: string;
  local: Observable<Record<string, Data>>;
  remote: Observable<Record<string, Data>>;
  saveLocal: (data: Diff<Data>) => Promise<void>;
  saveRemote: (data: Diff<Data>) => Promise<void>;
}) {
  RX.combineLatest([local, remote])
    .pipe(
      RX.distinctUntilChanged(
        (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
      ),
      RX.debounceTime(100),
      RX.map(([localData, remoteData]) =>
        getMergeDiffs({
          local: localData,
          remote: remoteData,
          lastUpdateDate: lastUpdate.get(collectionName),
        })
      )
    )
    .subscribe({
      next: ({ local, remote }) => {
        Promise.all([
          Promise.resolve(hasChanges(local)).then((changed) =>
            changed ? saveLocal(local) : undefined
          ),
          Promise.resolve(hasChanges(remote)).then((changed) =>
            changed ? saveRemote(remote) : undefined
          ),
        ])
          .then(() => {
            lastUpdate.update(collectionName);
          })
          .catch((error) => {
            console.error("Error saving data:", error);
          });
      },
      error: (error) => {
        console.error("Error during synchronization:", error);
      },
    });
}

export function hasChanges<Data>(diff: Diff<Data>): boolean {
  return Boolean(
    Object.keys(diff.created).length > 0 ||
      Object.keys(diff.updated).length > 0 ||
      Object.keys(diff.deleted).length > 0
  );
}
