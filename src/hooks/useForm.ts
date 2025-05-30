import { useReducer } from "react";

type ChangeAction<K extends keyof T, T extends Record<string, unknown>> = {
  key: K;
  payload: T[K];
};

export const useForm = <T extends Record<string, unknown>>(initialState: T) => {
  const onChange = <K extends keyof T>(
    state: T,
    { key, payload }: ChangeAction<K, T>
  ) => {
    return { ...state, [key]: payload };
  };

  const [form, setReducer] = useReducer(onChange, initialState);

  return {
    form,
    setValue:
      <K extends keyof T>(key: K) =>
      (payload: T[K]) => {
        setReducer({ key, payload });
      },
  } as const;
};
