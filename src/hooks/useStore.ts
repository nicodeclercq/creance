import { useContext, useEffect, useState } from "react";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import * as RemoteData from "@devexperts/remote-data-ts";
import { State } from "./../models/State";
import { save } from "../services/StoreService";
import { StoreContext } from "../StoreProvider";

export const useStore = () => {
  const c = useContext(StoreContext);

  console;
  const [state, setState] = useState<State>(c.value);

  useEffect(() => {
    const subscription = c
      ?.asObservable()
      .pipe(distinctUntilChanged(), debounceTime(100))
      .subscribe({
        next: setState,
      });

    return () => {
      try {
        subscription?.unsubscribe();
      } catch (e) {
        console.error("Unable to unsubscribe", e);
      }
    };
  }, [c]);

  return { state, setState: save } as const;
};
