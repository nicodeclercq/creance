import { RemoteDataState, useRemoteData } from "../../../utils/RemoteData";
import { useCallback, useState } from "react";

import { Button } from "../../../ui/Button/Button";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import type { Event } from "../../../models/Event";
import { Heading } from "../../../ui/Heading/Heading";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { LoadingIcon } from "../../../ui/Button/LoadingIcon";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import type { Participant } from "../../../models/Participant";
import { RadioGroup } from "../../../ui/Form/RadioGroup/RadioGroup";
import { Stack } from "../../../ui/Stack/Stack";
import { uid } from "../../../service/crypto";
import { useFetchEvent } from "../../../store/useFetchEvent";
import { useTranslation } from "react-i18next";

type JoinEventProps = {
  onNext: (data: {
    event: Event;
    participation: {
      isNew: boolean;
      participant: Participant;
    };
  }) => void;
  eventId: string;
  passKey: string;
};

function JoinEventHandler({
  event,
  onNext,
}: Omit<JoinEventProps, "eventId" | "passKey"> & { event: Event }) {
  const { t } = useTranslation();
  const [participant, setParticipant] = useState<string>();
  const [addedParticipant, setAddedParticipant] = useState<Participant>({
    _id: uid(),
    avatar: "",
    participantShare: { type: "default" },
    share: {
      adults: 1,
      children: 0,
    },
    updatedAt: new Date(),
    name: "",
  });

  const participantList = [
    ...Object.values(event?.participants?.collection ?? {}).map(
      (participant) => ({
        id: participant._id,
        label: participant.name,
        value: participant._id,
      }),
    ),
    {
      id: addedParticipant._id,
      value: addedParticipant._id,
      label: t("JoinPage.joinEvent.options.custom"),
    },
  ];

  const next = () => {
    if (!event || !participant) {
      return;
    }

    const tmpParticipant =
      participant === addedParticipant._id &&
      participant in event.participants.collection
        ? event.participants.collection[participant]
        : addedParticipant;

    onNext({
      event,
      participation: {
        isNew: participant === addedParticipant._id,
        participant: tmpParticipant,
      },
    });
  };

  return (
    <Stack gap="l" padding="m" justifyContent="stretch">
      <Heading>
        {t("JoinPage.joinEvent.title", { eventName: event.name })}
      </Heading>
      <RadioGroup
        direction="vertical"
        isRequired
        label={t("JoinPage.joinEvent.selectAParticipant.label")}
        onChange={(value) => setParticipant(value)}
        value={participant}
        options={participantList}
      />
      {participant === addedParticipant._id && (
        <>
          <Paragraph styles={{ font: "body-small" }}>
            {t("JoinPage.joinEvent.notInTheList")}
          </Paragraph>
          <InputText
            isRequired
            onChange={(name) => {
              setAddedParticipant((a) => ({
                ...a,
                name,
              }));
            }}
            value={addedParticipant.name}
            type="text"
            label={t("JoinPage.joinEvent.action.other")}
          />
        </>
      )}
      <Columns justify="end">
        <Button
          isDisabled={participant == null}
          onClick={next}
          label={t("JoinPage.joinEvent.action.next")}
        />
      </Columns>
    </Stack>
  );
}

export function JoinEvent({ onNext, eventId, passKey }: JoinEventProps) {
  const fetchEvent = useFetchEvent();
  const { t } = useTranslation();
  const remoteDataFetcher = useCallback(
    () => fetchEvent(eventId, passKey),
    [fetchEvent, eventId, passKey],
  );
  const remoteData = useRemoteData(remoteDataFetcher);

  return (
    <RemoteDataState
      data={remoteData}
      whenLoading={
        <Container
          styles={{
            display: "flex",
            minHeight: "10rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingIcon size="l" />
        </Container>
      }
      whenErrored={({ error }) => (
        <Container
          styles={{
            display: "flex",
            minHeight: "40rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack gap="m" justifyContent="center">
            <Paragraph>Error: {JSON.stringify(error)}</Paragraph>
            <Button
              label={t("JoinEvent.error.backToEventList")}
              as="link"
              to="EVENT_LIST"
              variant="primary"
            />
          </Stack>
        </Container>
      )}
      whenSuccessed={({ data }) => (
        <JoinEventHandler event={data} onNext={onNext} />
      )}
    />
  );
}
