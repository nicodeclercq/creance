import { useState } from "react";
import { Stack } from "../../../shared/layout/stack/stack";
import { Columns } from "../../../shared/layout/columns/columns";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { Avatar } from "../../../shared/library/avatar/avatar";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Icon, ICONS } from "../../../shared/library/icon/icon";
import { Confirm } from "../../../shared/library/modal/confirm";
import { Translate } from "../../../shared/translate/translate";
import { useCategoryState } from "../../../hooks/useCategoryState";
import { CategoryForm } from "../form/category-form";
import { Card } from "../../../shared/library/card/card";
import { ButtonAccent } from "../../../shared/library/button/buttonAccent";
import { Text } from "../../../shared/library/text/text/text";
import { Either } from "../../../components/Either";
import { useParams } from "react-router-dom";

type Add = { tag: "ADD" };
type Edit = { tag: "EDIT"; value: string };

const add = (): Add => ({ tag: "ADD" });
const edit = (value: string): Edit => ({ tag: "EDIT", value });
const isAdd = (obj: Add | Edit | undefined): obj is Add =>
  obj != null && obj.tag === "ADD";
const isEdit = (obj: Add | Edit | undefined, value: string) =>
  obj && obj.tag === "EDIT" && obj.value === value;

export function List() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const [editId, setEditId] = useState<Add | Edit | undefined>(undefined);
  const { getAll, remove } = useCategoryState(creanceId);
  const categories = getAll();

  const reset = () => {
    setEditId(undefined);
  };

  return (
    <Stack spacing="XL">
      <Either
        data={categories}
        onLeft={(e) => e}
        onRight={(categories) =>
          categories.map((category) =>
            isEdit(editId, category.id) ? (
              <Card isFlat>
                <CategoryForm
                  key={category.id}
                  category={category}
                  isMain={false}
                  onCancel={reset}
                  onSubmit={reset}
                />
              </Card>
            ) : (
              <Columns key={category.id} spacing="M">
                <ColumnFlexible>
                  <Avatar
                    size="L"
                    color={category.color}
                    name={category.name}
                    icon={category.icon}
                  />
                </ColumnFlexible>
                <ColumnRigid>
                  <Confirm
                    trigger={(open) => (
                      <ButtonGhost onClick={open}>
                        <Icon name={ICONS.TRASH} />
                      </ButtonGhost>
                    )}
                    action="category.delete"
                    onConfirm={() => {
                      remove(category.id);
                    }}
                  >
                    <Text>
                      <Translate name="category.delete.confirm" />
                    </Text>
                  </Confirm>
                </ColumnRigid>
                <ColumnRigid>
                  <ButtonAccent onClick={() => setEditId(edit(category.id))}>
                    <Icon name={ICONS.PENCIL} />
                  </ButtonAccent>
                </ColumnRigid>
              </Columns>
            )
          )
        }
      />
      {isAdd(editId) ? (
        <Card isFlat>
          <CategoryForm isMain={false} onCancel={reset} onSubmit={reset} />
        </Card>
      ) : (
        <ButtonAccent onClick={() => setEditId(add())}>
          <Translate name="category.add" />
        </ButtonAccent>
      )}
    </Stack>
  );
}
