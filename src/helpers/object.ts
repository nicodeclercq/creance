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
