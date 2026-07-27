import {
  addMergeableCollectionItem,
  createEmptyMergeableCollection,
  updateMergeableCollectionItem,
  updateMergeableRecord,
} from "../../models/mergeable";

import type { Account } from "../../models/Account";
import { Card } from "../../ui/Card/Card";
import { Container } from "../../ui/Container/Container";
import type { Event } from "../../models/Event";
import { JoinEvent } from "./private/JoinEvent";
import { Logger } from "../../service/Logger";
import type { Participant } from "../../models/Participant";
import type { ShareFormSubmitData } from "../participants/private/formParticipantShare";
import { Redirect } from "../../router/Redirect";
import { SetParticipantShare } from "./private/SetParticipantShare";
import { Welcome } from "./private/Welcome";
import { useAuth } from "../../store/useAuth";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useStoreData } from "../../store/useData";

export function JoinPage() {
  const { state: authState } = useAuth();
  const [state, setState] = useStoreData();
  const [isNewUser, setIsNewUser] = useState(false);
  const { eventId, shareId } = useParams();
  const [step, setStep] = useState(0);
  const [tmpEvent, setTmpEvent] = useState<{
    event: Event;
    participation: {
      isNew: boolean;
      participant: Participant;
    };
  }>();

  const decodedEventId = eventId ? decodeURIComponent(eventId) : undefined;
  const decodedShareId = shareId ? decodeURIComponent(shareId) : undefined;

  if (!decodedEventId || !decodedShareId) {
    Logger.log("Invalid join arguments")({ eventId, shareId });

    return <Redirect to="ROOT" />;
  }

  if (state.events.collection[decodedEventId] != null) {
    Logger.log("Already joined event")({ eventId });

    return <Redirect to="EVENT" params={{ eventId: decodedEventId }} />;
  }

  if (authState.type === "authenticated" && step === 0) {
    setStep((a) => a + 1);
    return;
  }

  const addUserParticipation = (tmp: {
    event: Event;
    participation: {
      isNew: boolean;
      participant: Participant;
    };
  }) => {
    setTmpEvent(tmp);
    // Go to next step
    setStep((a) => a + 1);
  };

  const storeDataAndContinue = ({
    share: participantShare,
    participationId,
  }: ShareFormSubmitData) => {
    if (!tmpEvent) {
      throw new Error("Previous step was not complete");
    }

    const { participation, event } = tmpEvent;
    const participant: Participant = {
      ...participation.participant,
      share:
        participantShare.type === "default" &&
        "shares" in participantShare &&
        participantShare.shares
          ? {
              adults: participantShare.shares.adults,
              children: participantShare.shares.children,
            }
          : participation.participant.share,
      participantShare:
        participantShare.type === "default"
          ? {
              type: "default",
            }
          : participantShare,
    };
    const eventWithParticipant = {
      ...event,
      participants:
        participant._id in event.participants.collection
          ? updateMergeableCollectionItem(
              participant._id,
              participant,
              event.participants,
            )
          : addMergeableCollectionItem(
              participant._id,
              participant,
              event.participants,
            ),
    };
    setState(({ account, events, users, ...other }) => ({
      ...other,
      users: addMergeableCollectionItem(
        participant._id,
        {
          _id: participant._id,
          share: participant.share,
          avatar: participant.avatar,
          name: participant.name,
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
                  adults: participant.share.adults,
                  children: participant.share.children,
                },
              }
            : {}),
        },
        events: addMergeableCollectionItem(
          decodedEventId,
          {
            eventId: decodedShareId,
            userId: participationId,
          },
          account.events,
        ),
      }),
      events: addMergeableCollectionItem(
        decodedEventId,
        eventWithParticipant,
        events,
      ),
    }));

    // Go to next step
    setStep((a) => a + 1);
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
        {step === 2 && tmpEvent != null && (
          <SetParticipantShare
            event={tmpEvent.event}
            participantList={tmpEvent.event.participants.collection}
            onPrevious={() => setStep((a) => a - 1)}
            onNext={storeDataAndContinue}
            participant={tmpEvent.participation.participant}
            participantShare={
              tmpEvent.participation.participant.participantShare
            }
          />
        )}
        {step === 3 && (
          <Redirect to="EVENT" params={{ eventId: decodedEventId }} />
        )}
      </Card>
    </Container>
  );
}
