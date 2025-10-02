import { Container } from "../../../ui/Container/Container";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Grid } from "../../../ui/Grid/Grid";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Stack } from "../../../ui/Stack/Stack";
import { useId } from "react";
import { useTranslation } from "react-i18next";

type DailyParticipationItemProps = {
  date: Date;
  periods: {
    AM?: {
      adults: number;
      children: number;
    };
    PM?: {
      adults: number;
      children: number;
    };
  };
  onChange: (periods: DailyParticipationItemProps["periods"]) => void;
};

export function DailyParticipationItem({
  date,
  onChange,
  periods,
}: DailyParticipationItemProps) {
  const { t } = useTranslation();
  const id = useId();

  const changePeriods =
    (period: "AM" | "PM", key: "adults" | "children") => (value: number) => {
      onChange({
        ...periods,
        [period]: {
          ...(periods[period] ?? { adults: 0, children: 0 }),
          [key]: value,
        },
      });
    };

  return (
    <Stack
      styles={{
        radius: "m",
        border: "default",
        overflow: "hidden",
      }}
    >
      <Container
        styles={{
          textAlign: "center",
          padding: "s",
          background: "inverted",
          color: "inverted",
        }}
      >
        <DateFormatter format="NoYear">{date}</DateFormatter>
      </Container>
      <Container styles={{ padding: "m" }}>
        <Grid
          columns={["max-content", "min-content", "min-content"]}
          gap="s"
          align="center"
          justify="center"
        >
          {/* Header */}
          <span />
          <Paragraph id={`${id}_adults`}>
            {t("DailyParticipationItem.header.adults")}
          </Paragraph>
          <Paragraph id={`${id}_children`}>
            {t("DailyParticipationItem.header.children")}
          </Paragraph>

          {/* Row */}
          {periods.AM && (
            <>
              <Paragraph id={`${id}_AM`} styles={{ textAlign: "end" }}>
                {t("DailyParticipationItem.header.AM")}
              </Paragraph>
              <InputNumber
                ariaLabelledby={`${id}_AM ${id}_adults`}
                label={t("DailyParticipationItem.header.adults")}
                type="number"
                as="number"
                isRequired
                value={periods.AM.adults}
                onChange={changePeriods("AM", "adults")}
              />
              <InputNumber
                ariaLabelledby={`${id}_AM ${id}_children`}
                label={t("DailyParticipationItem.header.children")}
                type="number"
                as="number"
                isRequired
                value={periods.AM.children}
                onChange={changePeriods("AM", "children")}
              />
            </>
          )}
          {periods.PM && (
            <>
              <Paragraph id={`${id}_PM`} styles={{ textAlign: "end" }}>
                {t("DailyParticipationItem.header.PM")}
              </Paragraph>
              <InputNumber
                ariaLabelledby={`${id}_PM ${id}_adults`}
                label={t("DailyParticipationItem.header.adults")}
                type="number"
                as="number"
                isRequired
                value={periods.PM.adults}
                onChange={changePeriods("PM", "adults")}
              />
              <InputNumber
                ariaLabelledby={`${id}_PM ${id}_children`}
                label={t("DailyParticipationItem.header.children")}
                type="number"
                as="number"
                isRequired
                value={periods.PM.children}
                onChange={changePeriods("PM", "children")}
              />
            </>
          )}
        </Grid>
      </Container>
    </Stack>
  );
}
