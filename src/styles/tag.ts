export const CONTAINER_TAG = {
  DIV: 'div',
  ARTICLE: 'article',
  ASIDE: 'aside',
  FOOTER: 'footer',
  HEADER: 'header',
  MAIN: 'main',
  SECTION: 'section',
} as const;

export type ContainerTag = typeof CONTAINER_TAG[keyof typeof CONTAINER_TAG];

export const TEXT_TAG = {
  P: 'p',
  SPAN: 'span',
} as const;

export type TextTag = typeof TEXT_TAG[keyof typeof TEXT_TAG];
