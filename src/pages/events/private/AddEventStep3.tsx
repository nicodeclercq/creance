import { FormData, ParticipantForm } from "../../participants/ParticipantForm";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { Button } from "../../../ui/Button/Button";
import { CheckboxList } from "../../../ui/FormField/CheckboxList/CheckboxList";
import { Columns } from "../../../ui/Columns/Columns";
import { Form } from "../../../ui/Form/Form";
import { Fragment } from "react/jsx-runtime";
import { Modal } from "../../../ui/Modal/Modal";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { User } from "../../../models/User";
import { uid } from "../../../service/crypto";
import { useState } from "react";
import { useStore } from "../../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export type Step3Data = {
  participants: Participant[];
};
type AddEventStep3Props = {
  data: Step3Data;
  onNext: (data: Step3Data) => void;
  onPrevious: (data: Step3Data) => void;
};

export function AddEventStep3({
  data,
  onNext,
  onPrevious,
}: AddEventStep3Props) {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentParticipantId] = useStore("currentParticipantId");
  const [selection, setSelection] = useState<Participant[]>(data.participants);
  const [account, setAccount] = useStore("account");

  const currentParticipant: Participant = {
    _id: currentParticipantId,
    name: account?.name ?? "",
    updatedAt: new Date(),
    avatar: account?.avatar ?? "",
    share: account?.share ?? {
      adults: 1,
      children: 0,
    },
    participantShare: { type: "default" },
  };

  const addParticipant = (data: FormData) => {
    const user: User = {
      _id: uid(),
      name: data.name,
      avatar: data.avatar,
      share: {
        adults: data.share.adults,
        children: data.share.children,
      },
      updatedAt: new Date(),
    };
    const newParticipant: Participant = {
      ...user,
      participantShare: { type: "default" },
    };

    setAccount((account) => {
      if (!account) return null;

      return {
        ...account,
        users: {
          ...account.users,
          [user._id]: user,
        },
      };
    });
    setSelection((s) => [...s, newParticipant]);
    setIsFormOpen(false);
  };

  const itemRenderer = (item: User) => (
    <Columns align="center" gap="s">
      <Avatar label={item.name} size="m" />
      {
        <div>
          <Paragraph styles={{ flexGrow: true }}>{item.name}</Paragraph>
          <Paragraph styles={{ font: "body-smaller" }}>
            {t("page.events.add.form.participant.share.count", {
              adults: item.share.adults,
              children: item.share.children,
            })}
          </Paragraph>
        </div>
      }
    </Columns>
  );

  const submit = () => () => {
    onNext({
      participants: selection,
    } as Step3Data);

    return Promise.resolve();
  };

  const onSelectionChange = (selection: User[]) => {
    const selectedParticipants = selection.map(
      (user) =>
        ({
          ...user,
          participantShare: { type: "default" },
        } as Participant)
    );
    setSelection([currentParticipant, ...selectedParticipants]);
  };

  return (
    <Form
      hasError={false}
      handleSubmit={submit}
      submit={{
        label: t("page.events.add.form.submit"),
        onClick: onNext,
      }}
      cancel={{
        label: t("page.events.add.form.previous"),
        onClick: () => onPrevious({ participants: selection }),
      }}
    >
      {currentParticipant && (
        <Columns align="center" justify="start">
          <Fragment key={currentParticipant._id}>
            <span style={{ width: "4rem" }}></span>
            {itemRenderer(currentParticipant)}
          </Fragment>
        </Columns>
      )}
      <CheckboxList
        onChange={onSelectionChange}
        items={Object.values(account?.users ?? {})
          .filter((user) => user._id !== currentParticipantId)
          .map((user) => ({
            label: user.name,
            id: user._id,
            value: user,
          }))}
        values={selection.map(({ participantShare, ...value }) => ({
          label: value.name,
          id: value._id,
          value,
        }))}
        valueRenderer={itemRenderer}
      />
      <Columns justify="center">
        <Button
          icon={{ name: "add", position: "start" }}
          variant="tertiary"
          onClick={() => setIsFormOpen(true)}
          label={t("AddEventStep3.actions.addParticipant")}
        />
      </Columns>
      <Modal
        title={t("AddEventStep3.actions.addParticipant")}
        isOpen={isFormOpen}
      >
        <ParticipantForm
          defaultValue={{
            name: "",
            avatar: "",
            share: {
              adults: 0,
              children: 0,
            },
          }}
          onSubmit={addParticipant}
          submitLabel={t("AddEventStep3.modal.addParticipant.submit")}
          users={account?.users ?? {}}
        />
      </Modal>
    </Form>
  );
}
