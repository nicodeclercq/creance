import { Avatar } from "../../../ui/Avatar/Avatar";
import { Button } from "../../../ui/Button/Button";
import { CheckboxList } from "../../../ui/FormField/CheckboxList/CheckboxList";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { Form } from "../../../ui/Form/Form";
import type { FormData } from "../../participants/ParticipantForm";
import { Fragment } from "react/jsx-runtime";
import { Icon } from "../../../ui/Icon/Icon";
import { Modal } from "../../../ui/Modal/Modal";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import type { Participant } from "../../../models/Participant";
import { ParticipantForm } from "../../participants/ParticipantForm";
import type { User } from "../../../models/User";
import { uid } from "../../../service/crypto";
import { useData } from "../../../store/useData";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type Step3Data = {
  participants: Participant[];
};
type AddEventStep3Props = {
  data: Step3Data;
  onNext: (data: Step3Data) => void;
  onPrevious: (data: Step3Data) => void;
};

const UserRenderer = ({
  user,
  isCurrentUser = false,
}: {
  user: User;
  isCurrentUser?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Columns align="center" gap="s" styles={{ radius: "s" }}>
      <Container styles={{ display: "inline-block", position: "relative" }}>
        <Avatar
          label={isCurrentUser ? t("currentUser.anonymous.name") : user.name}
          image={user.avatar}
          size={isCurrentUser ? "l" : "m"}
        />
        {isCurrentUser && (
          <Container
            styles={{
              position: "absolute",
              background: "inverted",
              color: "inverted",
              radius: "s",
              top: "75%",
              left: "0",
              display: "inline-block",
            }}
          >
            <Icon name="check" size="s" />
          </Container>
        )}
      </Container>
      {
        <div>
          <Paragraph styles={{ flexGrow: true }}>{user.name}</Paragraph>
          <Paragraph styles={{ font: "body-smaller" }}>
            {t("page.events.add.form.participant.share.count", {
              adults: user.share.adults,
              children: user.share.children,
            })}
          </Paragraph>
        </div>
      }
    </Columns>
  );
};

export function AddEventStep3({
  data,
  onNext,
  onPrevious,
}: AddEventStep3Props) {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selection, setSelection] = useState<Participant[]>(data.participants);
  const [account] = useData("account");
  const [users, setUsers] = useData("users");

  const currentParticipant: Participant = {
    ...account.currentUser,
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

    setUsers((users) => ({
      ...users,
      [user._id]: user,
    }));
    setSelection((s) => [...s, newParticipant]);
    setIsFormOpen(false);
  };

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
            <UserRenderer user={currentParticipant} isCurrentUser />
          </Fragment>
        </Columns>
      )}
      <CheckboxList
        onChange={onSelectionChange}
        items={Object.values(users)
          .filter((user) => user._id !== account?.currentUser._id)
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
        valueRenderer={(value) => <UserRenderer user={value} />}
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
          cancel={{
            label: t("AddEventStep3.modal.addParticipant.cancel"),
            onCancel: () => setIsFormOpen(false),
          }}
          submitLabel={t("AddEventStep3.modal.addParticipant.submit")}
          users={users}
        />
      </Modal>
    </Form>
  );
}
