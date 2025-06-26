export function removeFromObject<T extends Record<string, any>>(
  object: T,
  key: keyof T
): Omit<T, typeof key> {
  return Object.entries(object).reduce((acc, [k, v]) => {
    if (k !== key) {
      acc[k as Exclude<keyof T, typeof key>] = v;
    }
    return acc;
  }, {} as Omit<T, typeof key>);
}

export const withoutKey = <K extends keyof T, T extends Record<string, any>>(
  obj: T,
  key: K
): Omit<T, K> => {
  const { [key]: _, ...rest } = obj;
  return rest;
};
