import { useForm } from "react-hook-form";

import { uid } from "../../../uid";
import { Label } from "../../../shared/library/text/label/label";
import { Form } from "../../../shared/library/form/form";
import { User } from "../../../models/User";
import { useUserState } from "../../../hooks/useUserState";
import { Translate } from "../../../shared/translate/translate";
import { Registered } from "../../../models/Registerable";
import { getColor } from "../../../utils/color";

type Props = {
  onSubmit: (data: User) => void;
  onCancel: () => void;
  isMain?: boolean;
  user?: Registered<User>;
};

export function UserForm({ user, onSubmit, onCancel, isMain = true }: Props) {
  const id = uid();
  const { add, of, update, getAll } = useUserState();
  const { register, handleSubmit } = useForm();

  const submit = (data) => {
    const count = getAll().length;
    const newUser = of({
      id: user?.id,
      name: data.name,
      avatar: data.avatar,
      color: user?.color != null ? user.color : getColor(count),
      defaultDistribution: data.defaultDistribution,
    });
    if (user) {
      update(newUser);
    } else {
      add(newUser);
    }
    onSubmit(newUser);
  };

  return (
    <Form
      onSubmit={handleSubmit(submit)}
      onCancel={onCancel}
      submitLabel="user.form.submit.add"
      isMain={isMain}
    >
      <div>
        <Label htmlFor={`${id}-user-avatar`}>
          <Translate name="user.form.avatar" />
        </Label>
        <input
          {...register("avatar")}
          defaultValue={user?.avatar}
          id={`${id}-user-avatar`}
          type="text"
        />
      </div>
      <div>
        <Label htmlFor={`${id}-user-name`}>
          <Translate name="user.form.name" />
        </Label>
        <input
          {...register("name")}
          required
          defaultValue={user?.name}
          id={`${id}-user-name`}
          type="text"
        />
      </div>
      <div>
        <Label htmlFor={`${id}-user-repartition`}>
          <Translate name="user.form.repartition" />
        </Label>
        <input
          {...register("defaultDistribution")}
          defaultValue={user?.defaultDistribution || 1}
          min={0}
          id={`${id}-user-repartition`}
          type="number"
        />
      </div>
    </Form>
  );
}
