import { CARD_PADDING, Card } from "../../../../shared/library/card/card";
import { COLOR, toCssValue } from "../../../../entities/color";
import { ICONS, Icon } from "../../../../shared/library/icon/icon";

import { Accordion } from "../../../../components/accordion";
import { Avatar } from "../../../../shared/library/avatar/avatar";
import { ButtonGhost } from "../../../../shared/library/button/buttonGhost";
import { ButtonPrimary } from "../../../../shared/library/button/buttonPrimary";
import { Category } from "../../../../models/Category";
import { ColumnFlexible } from "../../../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../../../shared/layout/columns/column-rigid";
import { Columns } from "../../../../shared/layout/columns/columns";
import { Confirm } from "../../../../shared/library/modal/confirm";
import { Container } from "../../../../shared/layout/container/container";
import { Creance } from "../../../../models/State";
import { Currency } from "../../../../components/currency/currency";
import { Date } from "../../../../components/date/date";
import { Either } from "../../../../components/Either";
import { Expense } from "../../../../models/Expense";
import { Inline } from "../../../../shared/layout/inline/inline";
import { ROUTES } from "../../../../routes";
import { Registered } from "../../../../models/Registerable";
import { Stack } from "../../../../shared/layout/stack/stack";
import { Text } from "../../../../shared/library/text/text/text";
import { Title } from "../../../../shared/library/text/title/title";
import { Translate } from "../../../../shared/translate/translate";
import { User } from "../../../../models/User";
import { sort } from "../../../../utils/date";
import { useCategoryState } from "../../../../hooks/useCategoryState";
import { useCreanceState } from "../../../../hooks/useCreanceState";
import { useExpenseState } from "../../../../hooks/useExpenseState";
import { useParams } from "react-router-dom";
import { useRoute } from "../../../../hooks/useRoute";
import { useUserState } from "../../../../hooks/useUserState";

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
            <Either
              data={categoryEither}
              onLeft={() => <Avatar size="L" icon={ICONS.PIG} hideName />}
              onRight={(category: Category) => (
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
              )}
            />
          </ColumnFlexible>
          <ColumnRigid>
            <Currency value={expense.amount} />
          </ColumnRigid>
        </Columns>
      }
    >
      <Text>{expense.description}</Text>
      <span style={{ color: toCssValue(COLOR.GREY) }}>
        <Either
          data={userEither}
          onLeft={() => <Avatar size="M" name="Deleted User" />}
          onRight={(user: User) => (
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
          )}
        />
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
  const { expenses } = useExpenseState(creanceId);
  const { isLocked, currentCreance } = useCreanceState(creanceId);
  const { goTo } = useRoute();

  return (
    <Either
      data={expenses}
      onLeft={(e) => e}
      onRight={(expenses) => (
        <Card
          header={
            currentCreance && !isLocked(currentCreance) ? (
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
                  {currentCreance && !isLocked(currentCreance) && (
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
            {currentCreance &&
              expenses
                .sort((a, b) => sort(b.date, a.date))
                .map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    creance={currentCreance}
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
