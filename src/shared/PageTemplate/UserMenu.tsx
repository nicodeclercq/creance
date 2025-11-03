import { Avatar } from "../../ui/Avatar/Avatar";
import { Menu } from "../../ui/Menu/Menu";
import { Modal } from "../../ui/Modal/Modal";
import { SetCurrentParticipantForm } from "../../pages/auth/SetCurrentParticipantForm";
import type { User } from "../../models/User";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function UserMenu() {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [, setUsers] = useData("users");
  const [, setCurrentUser] = useData("account.currentUser");

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers((users) => ({
      ...users,
      [updatedUser._id]: updatedUser,
    }));
    setCurrentUser(() => updatedUser);
    setIsEditProfileOpen(false);
  };

  return currentUser ? (
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
        actions={[
          {
            label: t("component.pageTemplate.actions.editProfile"),
            icon: "edit",
            onClick: () => setIsEditProfileOpen(true),
          },
        ]}
        variant="primary"
      />
      <Modal
        title={t("page.setCurrentParticipant.title")}
        isOpen={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      >
        <SetCurrentParticipantForm
          defaultData={currentUser}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditProfileOpen(false)}
          cancelLabel={t("page.events.add.form.cancel")}
        />
      </Modal>
    </>
  ) : null;
}
