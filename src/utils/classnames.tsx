type Predicate = () => boolean;
type Props = string | { [key: string]: boolean | undefined | Predicate };

export const classNames = (names: Props | Props[]) => {
  const get = (n: Props) => {
    if (n == null) {
      return "";
    }
    return typeof n === "string"
      ? n
      : Object.entries(n)
          .filter(([_, isDisplayed]) => isDisplayed)
          .map(([key]) => key)
          .join(" ");
  };

  return Array.isArray(names) ? names.map(get).join(" ") : get(names);
};
