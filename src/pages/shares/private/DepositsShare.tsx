import { Avatar, computeRandomColor } from "../../../ui/Avatar/Avatar";
import {
  DepositShare,
  getTotalDepositAmount,
} from "../../../service/calculation";

import { Card } from "../../../ui/Card/Card";
import { Columns } from "../../../ui/Columns/Columns";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Divider } from "../../../ui/Divider/Divider";
import { ExchangeMoneyIcon } from "../../../ui/Icon/private/ExchangeMoneyIcon";
import { Heading } from "../../../ui/Heading/Heading";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

type DepositsShareProps = {
  deposits: DepositShare[];
  participants: Record<string, { name: string }>;
};

export function DepositsShare({ deposits, participants }: DepositsShareProps) {
  const { t } = useTranslation();

  const totalDepositAmount = getTotalDepositAmount(deposits);

  return (
    <Card>
      <Stack gap="m" justifyContent="stretch">
        <Columns gap="m" align="center">
          <Heading level={2} styles={{ font: "body-large", flexGrow: true }}>
            {t("page.participantshare.deposit.title")}
          </Heading>
          <Price type="total">{totalDepositAmount}</Price>
        </Columns>
        <Divider />
        {deposits.map((deposit) => (
          <Stack key={deposit._id}>
            <Columns gap="m" align="center">
              <span
                style={{
                  fontSize: "3.2rem",
                  color: computeRandomColor("deposit"),
                }}
              >
                <ExchangeMoneyIcon strokeWidth={0.5} />
              </span>
              <Stack>
                <DateFormatter>{deposit.date}</DateFormatter>
                <Columns align="center" gap="s">
                  <Avatar
                    label={
                      deposit.participantId in participants
                        ? participants[deposit.participantId].name
                        : "unknwon"
                    }
                    size="s"
                  />
                  <Paragraph styles={{ font: "body-small" }}>
                    {deposit.participantId in participants
                      ? participants[deposit.participantId].name
                      : deposit.participantId}
                  </Paragraph>
                </Columns>
              </Stack>
              <Price type="sum">{deposit.share}</Price>
            </Columns>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
