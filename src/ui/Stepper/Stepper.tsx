import classNames from "classnames";
import styles from "./Stepper.module.css";
import { type ReactNode } from "react";
import { Heading } from "../Heading/Heading";
import { Text } from "react-aria-components";
import { Paragraph } from "../Paragraph/Paragraph";
import { useTranslation } from "react-i18next";

type Step = {
  title: string;
  description: string;
};

type StepperProps = {
  steps: Step[];
  children: ReactNode;
  currentStep: number;
};

export function Stepper({
  currentStep: currentStepIndex,
  steps,
  children,
}: StepperProps) {
  const { t } = useTranslation();
  const stepIndicators = new Array(steps.length).fill(null).map((_, index) => (
    <div
      key={index}
      className={classNames(styles.indicator, {
        [styles.isActive]: index === currentStepIndex,
      })}
    ></div>
  ));

  const { title, description } = steps[currentStepIndex];

  return (
    <div data-component="Stepper" className={styles.stepper}>
      <Heading level={2} styles={{ font: "body-large", textAlign: "center" }}>
        <Text slot="label">{title}</Text>
      </Heading>
      <Paragraph styles={{ font: "body-small" }}>{description}</Paragraph>
      <div className={styles.step}>{children}</div>
      <div className={styles.indicatorWrapper}>{stepIndicators}</div>
      <Paragraph styles={{ font: "body-smaller", textAlign: "center" }}>
        {t("component.stepper.status", {
          current: currentStepIndex + 1,
          total: steps.length,
        })}
      </Paragraph>
    </div>
  );
}
