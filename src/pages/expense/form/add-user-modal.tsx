import { useModal } from "../../../hooks/useModal";
import { UserForm } from "../../../pages/user/form/user-form";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Translate } from "../../../shared/translate/translate";
import { ICONS } from "../../../shared/library/icon/icon";

export function AddUserModal() {
  const { Modal, setIsOpen } = useModal({
    title: "user.add",
    content: (
      <UserForm
        onCancel={() => setIsOpen(false)}
        onSubmit={() => {
          setIsOpen(false);
        }}
      />
    ),
    trigger: (
      <ButtonGhost
        iconRight={ICONS.ADD}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Translate name="user.add" />
      </ButtonGhost>
    ),
  });
  return <Modal />;
}
