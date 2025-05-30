import { Fragment, type ReactNode } from "react";
import { type Distribution } from "../../../service/calculation";
import { Stack } from "../../../ui/Stack/Stack";
import { Columns } from "../../../ui/Columns/Columns";
import { Avatar } from "../../../ui/Avatar/Avatar";
import { Card } from "../../../ui/Card/Card";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Icon } from "../../../ui/Icon/Icon";
import { useTranslation } from "react-i18next";
import { centToDecimal } from "../../../helpers/Number";
import * as ArrayFp from "fp-ts/Array";
import { pipe } from "fp-ts/function";
import styles from "./DistributionItem.module.css";

type DistributionItemProps = {
  isCurrentUser: boolean;
  userId: string;
  distributions: Distribution[];
  users: Record<string, { name: string }>;
};

export function DistributionItem({
  isCurrentUser,
  userId,
  distributions,
  users,
}: DistributionItemProps) {
  const { t } = useTranslation();
  const { left, right } = pipe(
    distributions,
    ArrayFp.partition((d) => d.type === "receive")
  );
  const values = {
    gives: left,
    receives: right,
  };

  const Container = ({ children }: { children: ReactNode }) =>
    isCurrentUser ? (
      <Stack gap="s" justifyContent="center" alignItems="center">
        {children}
      </Stack>
    ) : (
      <Columns gap="s" align="center">
        {children}
      </Columns>
    );

  return (
    <Card>
      <Stack gap="s">
        <Container>
          <Avatar label={users[userId].name} size={isCurrentUser ? "l" : "m"} />
          <Paragraph>{users[userId].name}</Paragraph>
        </Container>
        {(["gives", "receives"] as const).map((array) => (
          <Fragment key={array}>
            {values[array].length > 0 ? (
              <>
                <Paragraph>
                  {array === "gives"
                    ? t("page.distribution.gives")
                    : t("page.distribution.receives")}
                </Paragraph>
                <ul className={styles.list}>
                  {values[array].map(({ amount, type, user }, index) => (
                    <li key={index} className={styles.item}>
                      <Columns
                        gap="s"
                        align="center"
                        justify="start"
                        styles={{
                          color:
                            type === "give"
                              ? "failure-default"
                              : "primary-default",
                        }}
                      >
                        <Icon
                          name={type === "give" ? "minus" : "plus"}
                          size="s"
                        />
                        {type === "give"
                          ? t("page.distribution.gives.value", {
                              value: centToDecimal(amount),
                              user: users[user].name,
                            })
                          : t("page.distribution.receives.value", {
                              value: centToDecimal(amount),
                              user: users[user].name,
                            })}
                      </Columns>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <></>
            )}
          </Fragment>
        ))}
      </Stack>
    </Card>
  );
}
