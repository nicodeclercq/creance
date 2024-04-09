export const notEmpty = (str: string | undefined) =>
  str != null && str.trim().length > 0;
