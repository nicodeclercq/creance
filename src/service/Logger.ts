const isDebugActive = (): boolean => {
  return (
    window.location.search.includes("debug") ||
    localStorage.getItem("debug") === "true"
  );
};

export const Logger = {
  log:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.log(prefix, ...args);
      }
      return args[0];
    },
  error:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.error(prefix, ...args);
      }
      return args[0];
    },
  warn:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.warn(prefix, ...args);
      }
      return args[0];
    },
  info:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.info(prefix, ...args);
      }
      return args[0];
    },
  debug:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.debug(prefix, ...args);
      }
      return args[0];
    },
  trace:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.trace(prefix, ...args);
      }
      return args[0];
    },
  group:
    (prefix: string) =>
    <A extends unknown[]>(...args: A): A[0] => {
      if (isDebugActive()) {
        console.group(prefix, ...args);
      }
      return args[0];
    },
  groupEnd: () => {
    if (isDebugActive()) {
      console.groupEnd();
    }
  },
};
