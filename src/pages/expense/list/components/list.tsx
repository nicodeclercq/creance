import { fold } from "fp-ts/es6/Either";
import { useParams } from "react-router-dom";

import { useExpenseState } from "../../../../hooks/useExpenseState";
import { Card, CARD_PADDING } from "../../../../shared/library/card/card";
import { Stack } from "../../../../shared/layout/stack/stack";
import { ButtonPrimary } from "../../../../shared/library/button/buttonPrimary";
import { Registered } from "../../../../models/Registerable";
import { Expense } from "../../../../models/Expense";
import { Currency } from "../../../../components/currency/currency";
import { Date } from "../../../../components/date/date";
import { Translate } from "../../../../shared/translate/translate";
import { Columns } from "../../../../shared/layout/columns/columns";
import { ColumnFlexible } from "../../../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../../../shared/layout/columns/column-rigid";
import { ICONS, Icon } from "../../../../shared/library/icon/icon";
import { useUserState } from "../../../../hooks/useUserState";
import { Avatar } from "../../../../shared/library/avatar/avatar";
import { User } from "../../../../models/User";
import { useCategoryState } from "../../../../hooks/useCategoryState";
import { Category } from "../../../../models/Category";
import { ButtonGhost } from "../../../../shared/library/button/buttonGhost";
import { Text } from "../../../../shared/library/text/text/text";
import { Accordion } from "../../../../components/accordion";
import { Confirm } from "../../../../shared/library/modal/confirm";
import { useRoute } from "../../../../hooks/useRoute";
import { ROUTES } from "../../../../routes";
import { sort } from "../../../../utils/date";
import { toCssValue, COLOR } from "../../../../entities/color";
import { Container } from "../../../../shared/layout/container/container";
import { useCreanceState } from "../../../../hooks/useCreanceState";
import { Creance } from "../../../../models/State";
import { Title } from "../../../../shared/library/text/title/title";
import { Inline } from "../../../../shared/layout/inline/inline";
import { Either } from "../../../../components/Either";

function ExpenseItem({
  expense,
  creance,
}: {
  expense: Registered<Expense>;
  creance: Registered<Creance>;
}) {
  const { goTo } = useRoute();
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { get: getCategory } = useCategoryState(creanceId);
  const { get: getUser } = useUserState(creanceId);
  const { remove } = useExpenseState(creanceId);
  const { isLocked } = useCreanceState(creanceId);
  const userEither = getUser(expense.from);
  const categoryEither = getCategory(expense.category);

  const goToEditPage = () => {
    goTo(ROUTES.EXPENSE_EDIT, { ...params, id: expense.id });
  };

  return (
    <Accordion
      title={
        <Columns spacing="M" grow>
          <ColumnFlexible>
            {fold(
              () => <Avatar size="L" icon={ICONS.PIG} hideName />,
              (category: Category) => (
                <Columns spacing="S">
                  <Avatar
                    color={category.color}
                    size="L"
                    icon={category.icon}
                    name={category.name}
                    hideName
                  />
                  <Stack isFull>
                    <Text>{category.name}</Text>
                    <Date value={expense.date} />
                  </Stack>
                </Columns>
              )
            )(categoryEither)}
          </ColumnFlexible>
          <ColumnRigid>
            <Currency value={expense.amount} />
          </ColumnRigid>
        </Columns>
      }
    >
      <Text>{expense.description}</Text>
      <span style={{ color: toCssValue(COLOR.GREY) }}>
        {fold(
          () => <Avatar size="M" name="Deleted User" />,
          (user: User) => (
            <Inline spacing="S" align="CENTER">
              <Text>
                <Translate
                  name="page.expenses.from"
                  parameters={{ user: user.name }}
                />
              </Text>
              <Avatar
                color={user.color}
                size="M"
                name={user.name}
                image={user.avatar}
                hideName
              />
            </Inline>
          )
        )(userEither)}
      </span>
      {!isLocked(creance) && (
        <Columns spacing="M" margin="S">
          <ColumnRigid>
            <Confirm
              onConfirm={() => remove(expense.id)}
              trigger={(open) => (
                <ButtonGhost iconLeft={ICONS.TRASH} onClick={open}>
                  <Translate name="delete" />
                </ButtonGhost>
              )}
              action="delete"
            >
              <Text>
                <Translate name="expense.confirm.delete" />
              </Text>
            </Confirm>
          </ColumnRigid>
          <ColumnRigid>
            <ButtonPrimary iconLeft={ICONS.PENCIL} onClick={goToEditPage}>
              <Translate name="edit" />
            </ButtonPrimary>
          </ColumnRigid>
        </Columns>
      )}
    </Accordion>
  );
}

export function List() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getAll } = useExpenseState(creanceId);
  const { isLocked, getState } = useCreanceState(creanceId);
  const { goTo } = useRoute();
  const state = getState();
  const expenses = getAll();

  return (
    <Either
      data={expenses}
      onLeft={(e) => e}
      onRight={(expenses) => (
        <Card
          header={
            !isLocked(state) ? (
              <Container background="PRIMARY_LIGHT" padding={CARD_PADDING}>
                <Columns spacing="M" justify="SPACE_BETWEEN">
                  <Title>
                    <Translate
                      name={
                        expenses.length === 1
                          ? "page.expenses.count.singular"
                          : "page.expenses.count.plural"
                      }
                      parameters={{ count: expenses.length }}
                    />
                  </Title>
                  {!isLocked(state) && (
                    <ColumnRigid contentFit>
                      <ButtonGhost
                        withBackground
                        onClick={() =>
                          goTo(
                            ROUTES.EXPENSE_ADD,
                            params as { [key: string]: string }
                          )
                        }
                      >
                        <Icon name="ADD" />
                      </ButtonGhost>
                    </ColumnRigid>
                  )}
                </Columns>
              </Container>
            ) : undefined
          }
        >
          <Stack spacing="M">
            {expenses
              .sort((a, b) => sort(b.date, a.date))
              .map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  creance={state}
                />
              ))}
            {expenses.length === 0 && (
              <Container foreground="GREY" padding="M">
                <Stack align="CENTER" justify="CENTER">
                  <Icon name="CART" size="XXL" />
                  <Translate name="page.expenses.list.empty" />
                </Stack>
              </Container>
            )}
          </Stack>
        </Card>
      )}
    />
  );
}
