const CONDITION = {
  'LOWER': '<',
  'LOWER_OR_EQUAL': '<=',
  'UPPER': '>',
  'UPPER_OR_EQUAL': '>=',
} as const;

type Condition = typeof CONDITION[keyof typeof CONDITION];

type ResponsiveSize = `${Condition}${number}px`;
const RESPONSIZE_SIZE_REGEXP = new RegExp(`^(${Object.values(CONDITION).join('|')})([0-9.]+)px`);

type _Responsize<A> = {[k in ResponsiveSize]: A};
export type Responsive<A> = A | {[k in ResponsiveSize]: A} | undefined;

const isResponsiveSize = (value: string): value is ResponsiveSize => RESPONSIZE_SIZE_REGEXP.test(value);
const isResponsive = <A>(entry: any): entry is _Responsize<A> =>
  typeof entry === 'object'
  && Object.keys(entry).every(isResponsiveSize);

const createCondition = (type: Condition, value: number): string => {
  switch(type) {
    case CONDITION.LOWER:
      return `max-width: ${value - 1}px`;
    case CONDITION.LOWER_OR_EQUAL:
      return `max-width: ${value}px`;
    case CONDITION.UPPER:
      return `min-width: ${value + 1}px`;
    case CONDITION.UPPER_OR_EQUAL:
      return `min-width: ${value}px`;
  }
}

const parseResponsiveSize = (size: ResponsiveSize) => {
  const [_, condition, value] = Array.from(RESPONSIZE_SIZE_REGEXP.exec(size) || []);

  return {
    condition: condition as Condition,
    size: Number.parseInt(value),
  };
}

export const getStyle = <A>(responsive: Responsive<A>, formatter: (a: A) => string): string => {
  const createMediaQuery = (type: Condition, mediaSize: number, a: A) => `
    @media screen and (${createCondition(type, mediaSize)}) {
      ${formatter(a)}
    }
  `;

  return isResponsive(responsive)
    ? Object.entries(responsive as _Responsize<A>)
        .map(([key, value]) => {
          const {condition, size} = parseResponsiveSize(key as ResponsiveSize);
          return createMediaQuery(condition, size, value);
        })
        .join(' ')
    : responsive != null ? formatter(responsive) : '';
}

