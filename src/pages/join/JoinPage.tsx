import {
  addMergeableCollectionItem,
  createEmptyMergeableCollection,
  updateMergeableRecord,
} from "../../models/mergeable";

import type { Account } from "../../models/Account";
import { Card } from "../../ui/Card/Card";
import { Container } from "../../ui/Container/Container";
import type { Event } from "../../models/Event";
import { JoinEvent } from "./private/JoinEvent";
import { Logger } from "../../service/Logger";
import type { Participant } from "../../models/Participant";
import { Redirect } from "../../Redirect";
import { Welcome } from "./private/Welcome";
import { useAuth } from "../../store/useAuth";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useStoreData } from "../../store/useData";

export function JoinPage() {
  const { state } = useAuth();
  const [, setState] = useStoreData();
  const [isNewUser, setIsNewUser] = useState(false);
  const { eventId, shareId } = useParams();
  const [step, setStep] = useState(0);
  const decodedEventId = useMemo(() => eventId ? decodeURIComponent(eventId) : undefined, [eventId]);
  const decodedShareId = useMemo(() => shareId ? decodeURIComponent(shareId) : undefined, [shareId]);

  if (!eventId || !shareId) {
    Logger.log("Invalid join arguments")({ eventId, shareId });

    return <Redirect to="ROOT" />;
  }

  if (state.type === "authenticated" && step === 0) {
    setStep(1);
    return;
  }

  const addUserParticipation = ({
    event,
    participation,
  }: {
    event: Event;
    participation: {
      isNew: boolean;
      participant: Participant;
    };
  }) => {
    setState(({ account, events, users, ...other }) => ({
      ...other,
      users: addMergeableCollectionItem(
        participation.participant._id,
        {
          _id: participation.participant._id,
          share: participation.participant.share,
          avatar: participation.participant.avatar,
          name: participation.participant.name,
        },
        users ?? createEmptyMergeableCollection(),
      ),
      account: updateMergeableRecord({
        ...(account as Account),
        currentUser: {
          ...account.currentUser,
          // Set participation as default on new user
          ...(isNewUser
            ? {
                share: {
                  adults: participation.participant.share.adults,
                  children: participation.participant.share.children,
                },
              }
            : {}),
        },
        events: addMergeableCollectionItem(
          eventId,
          {
            key: decodedShareId!,
            uid: participation.participant._id,
          },
          account.events,
        ),
      }),
      events: addMergeableCollectionItem(eventId, event, events),
    }));

    // Go to next step
    setStep(2);
  };

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
      <Card styles={{ maxWidth: "min(90vw, 70ch)" }}>
        {step === 0 && (
          <Welcome
            onNext={(isNew) => {
              setIsNewUser(isNew);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <JoinEvent
            onNext={addUserParticipation}
            eventId={decodedEventId}
            passKey={decodedShareId}
          />
        )}
        {step === 2 && <Redirect to="EVENT" params={{ eventId }} />}
      </Card>
    </Container>
  );
}
