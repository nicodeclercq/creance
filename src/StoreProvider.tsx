import { ReactNode, createContext, useEffect, useState } from "react";
import { BehaviorSubject, Observable } from "rxjs";

import { Loader } from "./pages/loader/loader";
import { State } from "./models/State";
import { Store } from "./services/StoreService";

export type Connection = { connect: (obs: Observable<State>) => () => void };

type Props = {
  store: BehaviorSubject<State>;
  connections: Connection[];
  load: () => Promise<State>;
  children: ReactNode;
};

export const StoreContext = createContext(Store);

export const StoreProvider = ({
  store,
  connections,
  load,
  children,
}: Props) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(
    function connectStores() {
      const subscriptions = connections.map((connection) =>
        connection.connect(store.asObservable())
      );
      return () => subscriptions.forEach((unsubscribe) => unsubscribe());
    },
    [connections, store]
  );

  useEffect(
    function initState() {
      load().then((state) => {
        store.next(state);
        setIsReady(true);
      });
    },
    [load, store]
  );

  return (
    <StoreContext.Provider value={store}>
      {isReady ? children : <Loader />}
    </StoreContext.Provider>
  );
};
