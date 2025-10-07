import { Avatar, computeRandomColor } from "../../../ui/Avatar/Avatar";

import { Card } from "../../../ui/Card/Card";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Divider } from "../../../ui/Divider/Divider";
import { Event } from "../../../models/Event";
import { ExpenseShareByParticipant } from "../../../service/calculation";
import { Heading } from "../../../ui/Heading/Heading";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { PieChart } from "../../../ui/Pie/PieChart";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { centToDecimal } from "../../../helpers/Number";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useTranslation } from "react-i18next";

type ExpenseShareProps = {
  total: number;
  sharesByCategory: Record<string, number>;
  participants: Record<string, Participant>;
  expenses: ExpenseShareByParticipant[];
  event: Event;
};

export function ExpenseShare({
  total,
  event,
  participants,
  expenses,
  sharesByCategory,
}: ExpenseShareProps) {
  const { t } = useTranslation();
  const { isCurrentUser } = useCurrentUser();

  return (
    <Card>
      <Stack gap="m" justifyContent="stretch">
        <Columns gap="m">
          <Heading level={2} styles={{ font: "body-large", flexGrow: true }}>
            {t("page.participantshare.shares.title")}
          </Heading>
          <Price type="total">{total}</Price>
        </Columns>
        <Container styles={{ textAlign: "center" }}>
          <PieChart
            data={Object.entries(sharesByCategory).map(([key, value]) => ({
              id: key,
              label:
                key in event.categories
                  ? event.categories[key].name
                  : t(key === "deposit" ? "deposit" : "category.unknwon"),
              value: centToDecimal(value),
              color: computeRandomColor(
                key in event.categories ? event.categories[key].icon : key
              ),
            }))}
            valueFormatter={(value) => t("component.price.value", { value })}
          />
        </Container>
        <Divider />
        {expenses.map((expense) => (
          <Stack key={expense._id}>
            <Columns gap="m" align="center">
              <CategoryIcon
                name={event.categories[expense.category].icon}
                label={event.categories[expense.category].name}
                size="m"
              />
              <Stack>
                <Paragraph>
                  <DateFormatter format="long">{expense.date}</DateFormatter>
                </Paragraph>
                <Columns align="center" gap="s">
                  <Avatar
                    label={participants[expense.lender].name}
                    image={participants[expense.lender].avatar}
                    size="s"
                  />
                  <Paragraph styles={{ font: "body-small" }}>
                    {isCurrentUser(participants[expense.lender])
                      ? t("currentUser.anonymous.name")
                      : participants[expense.lender].name}
                  </Paragraph>
                </Columns>
              </Stack>
              <Price type="sum">{expense.share}</Price>
            </Columns>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
