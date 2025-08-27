import * as TaskEither from "fp-ts/TaskEither";

import { pipe } from "fp-ts/function";

export function fork<T, E = Error>({
  onError,
  onSuccess,
}: {
  onError: (error: E) => void;
  onSuccess: (data: T) => void;
}) {
  return (task: TaskEither.TaskEither<E, T>) =>
    pipe(
      task,
      TaskEither.fold(
        (error) => () => Promise.reject(error),
        (data) => () => Promise.resolve(data)
      ),
      (task) => task().then(onSuccess).catch(onError)
    );
}
