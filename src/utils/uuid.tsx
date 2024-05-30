let __uuid = 0;

export function uuid(prefix?: string) {
  return `uuid__${prefix ?? ""}${__uuid++}`;
}
