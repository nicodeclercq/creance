import { Alert } from "../../ui/Alert/Alert";
import { Avatar } from "../../ui/Avatar/Avatar";
import { ConfirmButton } from "../../ui/ConfirmButton/ConfirmButton";
import { Menu } from "../../ui/Menu/Menu";
import { Modal } from "../../ui/Modal/Modal";
import { SetCurrentParticipantForm } from "../../pages/auth/SetCurrentParticipantForm";
import { Stack } from "../../ui/Stack/Stack";
import type { User } from "../../models/User";
import { updateMergeableCollectionItem } from "../../models/mergeable";
import { useAuth } from "../../store/useAuth";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function UserMenu() {
  const { eventId: currentEventId } = useParams();
  const { logout, state: authState } = useAuth();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [users, setUsers] = useData("users");
  const [account, setAccount] = useData("account");
  const [participants, setParticipants] = useData(
    `events.collection.${currentEventId}.participants`,
  );

  const currentParticipant = currentEventId
    ? participants?.collection[account.events.collection[currentEventId].userId]
    : undefined;

  const handleUpdateProfile = (updatedUser: User) => {
    if (!currentEventId) {
      setUsers((users) =>
        updateMergeableCollectionItem(updatedUser._id, updatedUser, users),
      );
      setAccount((account) => ({ ...account, currentUser: updatedUser }));
    } else {
      setParticipants((participants) => {
        const userId = account.events.collection[currentEventId].userId;
        const newParticipantData = {
          ...participants.collection[userId],
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          share: updatedUser.share,
          updatedAt: new Date(),
        };

        return updateMergeableCollectionItem(
          userId,
          newParticipantData,
          participants,
        );
      });
    }

    setIsEditProfileOpen(false);
  };

  const handleLogin = () => {
    logout();
  };

  const authenticatedActions = [
    {
      label: t("component.pageTemplate.actions.editProfile"),
      icon: "edit" as const,
      onClick: () => setIsEditProfileOpen(true),
    },
    {
      label: t("component.pageTemplate.actions.logout"),
      icon: "lock" as const,
      onClick: logout,
    },
  ];

  const anonymousActions = [
    {
      label: t("component.pageTemplate.actions.editProfile"),
      icon: "edit" as const,
      onClick: () => setIsEditProfileOpen(true),
    },
    {
      label: t("component.pageTemplate.actions.login"),
      icon: "unlock" as const,
      onClick: handleLogin,
      confirmation: {
        title: t("component.pageTemplate.actions.login.confirmation.title"),
        description: t(
          "component.pageTemplate.actions.login.confirmation.description",
        ),
        confirm: {
          label: t("component.pageTemplate.actions.login.confirmation.confirm"),
          onClick: handleLogin,
        },
        cancel: {
          label: t("component.pageTemplate.actions.login.confirmation.cancel"),
        },
      },
    },
  ];

  const actions =
    authState.type === "authenticated"
      ? authenticatedActions
      : anonymousActions;

  if (!currentUser) {
    return authState.type === "anonymous" ? (
      <ConfirmButton
        action={{
          variant: "primary",
          label: t("component.pageTemplate.actions.login"),
        }}
        title={t("component.pageTemplate.actions.login.confirmation.title")}
        description={t(
          "component.pageTemplate.actions.login.confirmation.description",
        )}
        confirm={{
          label: t("component.pageTemplate.actions.login.confirmation.confirm"),
          onClick: handleLogin,
        }}
        cancel={{
          label: t("component.pageTemplate.actions.login.confirmation.cancel"),
        }}
      />
    ) : undefined;
  }

  return (
    <>
      <Menu
        label={t("component.pageTemplate.actions.more")}
        labelRenderer={() =>
          currentParticipant && currentEventId ? (
            <Avatar
              id={currentParticipant._id}
              label={currentParticipant.name}
              image={currentParticipant.avatar}
              size="m"
            />
          ) : (
            <Avatar
              id={currentUser._id}
              label={currentUser.name}
              image={currentUser.avatar}
              size="m"
            />
          )
        }
        actions={actions}
        variant="primary"
      />
      <Modal
        title={t("page.setCurrentParticipant.title")}
        isOpen={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      >
        <Stack gap="m">
          <Alert type="subtle">
            {t(
              currentEventId
                ? "UserMenu.editProfile.event.alert"
                : "UserMenu.editProfile.main.alert",
            )}
          </Alert>
          <SetCurrentParticipantForm
            defaultData={currentEventId ? currentParticipant : currentUser}
            users={users.collection}
            onSubmit={handleUpdateProfile}
            onCancel={() => setIsEditProfileOpen(false)}
            cancelLabel={t("page.events.add.form.cancel")}
          />
        </Stack>
      </Modal>
    </>
  );
}
