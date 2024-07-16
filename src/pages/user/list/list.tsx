import { useState } from "react";

import { useUserState } from "../../../hooks/useUserState";
import { Stack } from "../../../shared/layout/stack/stack";
import { Inline } from "../../../shared/layout/inline/inline";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { UserForm } from "../../../pages/user/form/user-form";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { Avatar } from "../../../shared/library/avatar/avatar";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Icon, ICONS } from "../../../shared/library/icon/icon";
import { Confirm } from "../../../shared/library/modal/confirm";
import { Translate } from "../../../shared/translate/translate";
import { Card } from "../../../shared/library/card/card";
import { Text } from "../../../shared/library/text/text/text";
import { ButtonAccent } from "../../../shared/library/button/buttonAccent";
import { useParams } from "react-router-dom";
import { Either } from "../../../components/Either";

type Add = { tag: "ADD" };
type Edit = { tag: "EDIT"; value: string };

const add = (): Add => ({ tag: "ADD" });
const edit = (value: string): Edit => ({ tag: "EDIT", value });
const isAdd = (obj: Add | Edit | undefined): obj is Add =>
  obj && obj.tag === "ADD";
const isEdit = (obj: Add | Edit | undefined, value: string) =>
  obj && obj.tag === "EDIT" && obj.value === value;

export function List() {
  const [editId, setEditId] = useState<Add | Edit | undefined>(undefined);
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getAll, remove } = useUserState(creanceId);
  const users = getAll();

  const reset = () => {
    setEditId(undefined);
  };

  return (
    <Stack spacing="XL">
      <Either
        data={users}
        onLeft={() => <Text>No user</Text>}
        onRight={(users) =>
          users.map((user) =>
            isEdit(editId, user.id) ? (
              <Card isFlat>
                <UserForm
                  key={user.id}
                  user={user}
                  isMain={false}
                  onCancel={reset}
                  onSubmit={reset}
                />
              </Card>
            ) : (
              <Inline key={user.id} spacing="M">
                <ColumnFlexible>
                  <Avatar
                    size="L"
                    color={user.color}
                    name={user.name}
                    image={user.avatar}
                  />
                </ColumnFlexible>
                <ColumnRigid>
                  <Confirm
                    trigger={(open) => (
                      <ButtonGhost onClick={open}>
                        <Icon name={ICONS.TRASH} />
                      </ButtonGhost>
                    )}
                    action="user.delete"
                    onConfirm={() => {
                      remove(user.id);
                    }}
                  >
                    <Text>
                      <Translate name="user.delete.confirm" />
                    </Text>
                  </Confirm>
                </ColumnRigid>
                <ColumnRigid>
                  <ButtonAccent onClick={() => setEditId(edit(user.id))}>
                    <Icon name={ICONS.PENCIL} />
                  </ButtonAccent>
                </ColumnRigid>
              </Inline>
            )
          )
        }
      />
      {isAdd(editId) ? (
        <Card isFlat>
          <UserForm isMain={false} onCancel={reset} onSubmit={reset} />
        </Card>
      ) : (
        <ButtonAccent onClick={() => setEditId(add())}>
          <Translate name="user.add" />
        </ButtonAccent>
      )}
    </Stack>
  );
}
