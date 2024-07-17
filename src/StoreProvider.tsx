import { ReactNode, createContext, useEffect, useState } from "react";
import { debounceTime, distinctUntilChanged, map, Observable } from "rxjs";

import { Loader } from "./pages/loader/loader";
import { State } from "./models/State";
import { Runtime, Store } from "./services/StoreService";

export type Connection = { connect: (obs: Observable<State>) => () => void };

type Props = {
  children: ReactNode;
};

export const StoreContext = createContext(Store);

export const StoreProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscriptions = Runtime.pipe(
      map((state) => state.isLoading),
      distinctUntilChanged(),
      debounceTime(2000)
    ).subscribe(setIsLoading);

    return () => subscriptions.unsubscribe();
  }, []);

  return (
    <StoreContext.Provider value={Store}>
      {isLoading ? <Loader /> : children}
    </StoreContext.Provider>
  );
};
