import { useForm } from "react-hook-form";

import { uid } from "../../../uid";
import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import { Label } from "../../../shared/library/text/label/label";
import { Form } from "../../../shared/library/form/form";
import { User } from "../../../models/User";
import { useUserState } from "../../../hooks/useUserState";
import { Translate } from "../../../shared/translate/translate";
import * as Registerable from "../../../models/Registerable";
import { getColor } from "../../../utils/color";
import { useParams } from "react-router-dom";

type Props = {
  onSubmit: (data: User) => void;
  onCancel: () => void;
  isMain?: boolean;
  user?: Registerable.Registered<User>;
};

export function UserForm({ user, onSubmit, onCancel, isMain = true }: Props) {
  const id = uid();
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { add, of, update, getAll } = useUserState(creanceId);
  const { register, handleSubmit } = useForm();

  const submit = (data) => {
    const count = pipe(
      getAll(),
      Either.fold(
        () => 0,
        (users) => users.length
      )
    );
    const newUser = of({
      id: user?.id,
      name: data.name,
      avatar: data.avatar,
      color: user?.color != null ? user.color : getColor(count),
      defaultDistribution: data.defaultDistribution,
    });
    if (user) {
      update(newUser as Registerable.Registered<User>);
    } else {
      add(newUser as Registerable.Unregistered<User>);
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
