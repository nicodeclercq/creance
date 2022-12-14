export type Join<T extends string[], Separator extends string = ''> =
    T extends [infer First] ? First
  : T extends [infer First extends string, ...infer Rest extends string[]] ? `${First}${Separator}${Join<Rest, Separator>}`
  : '';