type EmptyData = {
  type: "empty";
};
type Data<T> = {
  type: "data";
  data: T;
};
type ErrorData<E> = {
  type: "error";
  error: E;
};
type RemoteData<E, T> = EmptyData | Data<T> | ErrorData<E>;

export function isEmpty<E, T>(data: RemoteData<E, T>): data is EmptyData {
  return data.type === "empty";
}
export function isData<E, T>(data: RemoteData<E, T>): data is Data<T> {
  return data.type === "data";
}
export function isError<E, T>(data: RemoteData<E, T>): data is ErrorData<E> {
  return data.type === "error";
}

export function of<T, E = Error>(data: T): RemoteData<E, T> {
  return { type: "data", data };
}
export function fromNullable<T, E = Error>(
  data: T | null | undefined
): RemoteData<E, T> {
  if (data === null || data === undefined) {
    return { type: "empty" };
  }
  return { type: "data", data };
}

export function map<A, B, E>(
  data: RemoteData<E, A>,
  fn: (data: A) => B
): RemoteData<E, B> {
  if (isEmpty(data)) {
    return data;
  }
  if (isError(data)) {
    return data;
  }
  return { type: "data", data: fn(data.data) };
}

export function chain<A, B, E>(
  data: RemoteData<E, A>,
  fn: (data: A) => RemoteData<E, B>
): RemoteData<E, B> {
  if (isEmpty(data)) {
    return data;
  }
  if (isError(data)) {
    return data;
  }
  return fn(data.data);
}

export function fold<A, B, E>(
  data: RemoteData<E, A>,
  onEmpty: () => B,
  onData: (data: A) => B,
  onError: (error: E) => B
): B {
  if (isEmpty(data)) {
    return onEmpty();
  }
  if (isError(data)) {
    return onError(data.error);
  }
  return onData(data.data);
}
