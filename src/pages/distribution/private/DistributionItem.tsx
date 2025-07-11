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
  isCurrentParticipant: boolean;
  participantId: string;
  distributions: Distribution[];
  participants: Record<string, { name: string }>;
};

export function DistributionItem({
  isCurrentParticipant,
  participantId,
  distributions,
  participants,
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

  const Wrapper = ({ children }: { children: ReactNode }) =>
    isCurrentParticipant ? (
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
      <Stack>
        <Wrapper>
          <Avatar
            label={participants[participantId].name}
            size={isCurrentParticipant ? "l" : "m"}
          />
          <Paragraph>{participants[participantId].name}</Paragraph>
        </Wrapper>
        {(["gives", "receives"] as const).map((array) => (
          <Fragment key={array}>
            {values[array].length > 0 ? (
              <>
                <div style={{ paddingInlineStart: "4rem" }}>
                  <Paragraph>
                    <strong>
                      {array === "gives"
                        ? t("page.distribution.gives")
                        : t("page.distribution.receives")}
                    </strong>
                  </Paragraph>
                </div>
                <ul className={styles.list}>
                  {values[array].map(
                    ({ amount, type, participant: participantId }, index) => (
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
                                participant: participants[participantId].name,
                              })
                            : t("page.distribution.receives.value", {
                                value: centToDecimal(amount),
                                participant: participants[participantId].name,
                              })}
                        </Columns>
                      </li>
                    )
                  )}
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
