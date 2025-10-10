import { Store, StoreManager } from "./store/StoreManager";

import { Container } from "./ui/Container/Container";
import { FormData } from "./pages/participants/ParticipantForm";
import { LoadingIcon } from "./ui/Button/LoadingIcon";
import { ReactNode } from "react";
import { Redirect } from "./Redirect";
import { SetCurrentParticipantPage } from "./pages/auth/SetCurrentParticipantPage";
import { State } from "./store/state";
import { uid } from "./service/crypto";
import { useData } from "./store/useData";
import { useStore } from "./store/useStore";

type Props = {
  children: ReactNode;
};

export function PrivatePage({ children }: Props) {
  const [store, setStore] = useStore();
  const [account] = useData("account");

  const submit = (data: FormData) => {
    setStore((oldValue: Store<State>): Store<State> => {
      if (StoreManager.hasData(oldValue)) {
        const newCurrentParticipantId = uid();

        return {
          type: oldValue.type,
          data: {
            ...oldValue.data,
            account: {
              ...(oldValue.data.account ?? {}),
              currentUser: {
                _id: newCurrentParticipantId,
                updatedAt: new Date(),
                ...data,
              },
            },
          },
        };
      }

      return oldValue as Store<State>;
    });
  };

  switch (store.type) {
    case "loading":
      return (
        <Container
          styles={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "inverted",
            padding: "l",
            color: "inverted",
          }}
        >
          <LoadingIcon size="l" />
        </Container>
      );
    case "ready":
      return <Redirect to="LOGIN" />;
    case "authenticated":
      return !account ? (
        <SetCurrentParticipantPage onSubmit={submit} />
      ) : (
        <>{children}</>
      );
  }
}
