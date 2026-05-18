import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Fn } from "../helpers/function";

export type RemoteData<U> =
  | {
      state: "initial";
    }
  | {
      state: "loading";
    }
  | {
      state: "success";
      data: U;
    }
  | {
      state: "error";
      error: Error;
    };

export const useRemoteData = <U,>(data: Promise<U> | Fn<[], Promise<U>>) => {
  const [remoteData, setRemoteData] = useState<RemoteData<U>>({
    state: "initial",
  });

  const promise = useMemo(
    () => (typeof data === "function" ? data() : data),
    [data],
  );

  useEffect(() => {
    let isMount = true;

    setRemoteData({
      state: "loading",
    });

    promise
      .then((result) => {
        if (isMount) {
          setRemoteData({
            state: "success",
            data: result,
          });
        }
      })
      .catch((e) => {
        if (isMount) {
          setRemoteData({
            state: "error",
            error: e,
          });
        }
      });

    return () => {
      isMount = false;
    };
  }, [promise]);

  return remoteData;
};

type RemoteDataStateProps<U> = {
  data: RemoteData<U>;
  whenLoading: ReactNode | (() => ReactNode);
  whenErrored: ReactNode | ((e: { error: Error }) => ReactNode);
  whenSuccessed: (d: { data: U }) => ReactNode;
};
export const RemoteDataState = <U,>({
  data,
  whenLoading,
  whenErrored,
  whenSuccessed,
}: RemoteDataStateProps<U>) => {
  switch (data.state) {
    case "loading":
      const LoadingRenderer =
        typeof whenLoading === "function" ? whenLoading : () => whenLoading;
      return <LoadingRenderer />;
    case "error":
      const ErrorRenderer =
        typeof whenErrored === "function" ? whenErrored : () => whenErrored;
      return <ErrorRenderer error={data.error} />;
    case "success":
      const SuccessRenderer =
        typeof whenSuccessed === "function"
          ? whenSuccessed
          : () => whenSuccessed;
      return <SuccessRenderer data={data.data} />;
  }
};
