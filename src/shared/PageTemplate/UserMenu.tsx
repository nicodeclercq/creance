import { Avatar } from "../../ui/Avatar/Avatar";
import { ConfirmButton } from "../../ui/ConfirmButton/ConfirmButton";
import { Menu } from "../../ui/Menu/Menu";
import { Modal } from "../../ui/Modal/Modal";
import { SetCurrentParticipantForm } from "../../pages/auth/SetCurrentParticipantForm";
import type { User } from "../../models/User";
import { useAuth } from "../../store/useAuth";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function UserMenu() {
  const { logout, state: authState } = useAuth();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [users, setUsers] = useData("users");
  const [, setCurrentUser] = useData("account.currentUser");

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers((users) => ({
      ...users,
      [updatedUser._id]: updatedUser,
    }));
    setCurrentUser(() => updatedUser);
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
        description: t("component.pageTemplate.actions.login.confirmation.description"),
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
        description={t("component.pageTemplate.actions.login.confirmation.description")}
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
        labelRenderer={() => (
          <Avatar
            label={currentUser.name}
            image={currentUser.avatar}
            size="m"
          />
        )}
        actions={actions}
        variant="primary"
      />
      <Modal
        title={t("page.setCurrentParticipant.title")}
        isOpen={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      >
        <SetCurrentParticipantForm
          defaultData={currentUser}
          users={users.collection}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditProfileOpen(false)}
          cancelLabel={t("page.events.add.form.cancel")}
        />
      </Modal>
    </>
  );
}
