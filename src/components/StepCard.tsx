import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { Card } from "./Card";
import { LazyFn } from "../../@types/function";
import { getValue } from "../infrastructure/function";
import { css } from "@emotion/css";
import { Center } from "./layout/center";
import { Flex } from "./layout/flex";
import { Button } from "./Button";
import { Visibility } from "./layout/Visibility";
import { VAR, radius } from "../theme/style";
import { Grid } from "./layout/grid";

type Props = {
  steps: Array<ReactNode | LazyFn<ReactNode>>;
  lastStepButton: {
    text: string;
    onClick: () => void;
  };
  currentStep?: number;
  allowDirectNavigation?: boolean;
  onChange: (newStep: number) => void;
};

const stepButtonStyle = (isActive: boolean) =>
  css(`
    padding: 0;
    flex: none;
    height: 1rem;
    width: 1rem;
    ${radius("ROUND")}
    background: ${
      isActive ? VAR.COLOR.BRAND.SURFACE.BASE : VAR.COLOR.NEUTRAL.SURFACE.BASE
    };
    border: 1px solid ${
      isActive
        ? VAR.COLOR.BRAND.SURFACE.STRONG
        : VAR.COLOR.NEUTRAL.SURFACE.STRONG
    };
  `);
type StepButtonProps = {
  isActive?: boolean;
  onClick?: () => void;
};
const StepButton = ({ onClick, isActive = false }: StepButtonProps) => {
  return <button className={stepButtonStyle(isActive)} onClick={onClick} />;
};

const style = css(`
  display: grid;
  gap: ${VAR.SIZE.GAP.M};
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr min-content;
`);

export function StepCard({
  steps,
  lastStepButton,
  allowDirectNavigation = false,
  currentStep = 0,
  onChange,
}: Props) {
  const [step, setStep] = useState(
    currentStep < steps.length - 1 ? currentStep : 0
  );

  const isLast = step === steps.length - 1;

  const goToStep = useCallback(
    (nextStep: number) => () => {
      if (nextStep >= 0 && nextStep < steps.length) {
        onChange(nextStep < steps.length ? nextStep : nextStep - 1);
        setStep(nextStep);
      }
    },
    [steps]
  );

  const StepButtons = useMemo(
    () =>
      new Array(steps.length)
        .fill(0)
        .map((_, index) => (
          <StepButton
            key={index}
            isActive={step === index}
            onClick={allowDirectNavigation ? goToStep(index) : undefined}
          />
        )),
    [step, steps, allowDirectNavigation, goToStep]
  );
  const ActiveStep = useMemo(() => getValue(steps[step]), [steps, step]);

  return (
    <Card>
      <Grid
        columns={1}
        gap={VAR.SIZE.GAP.M}
        rows={["min-content", "1fr", "min-content"]}
      >
        <Center direction="HORIZONTAL">
          <Flex isInline direction="HORIZONTAL" gap="S">
            {StepButtons}
          </Flex>
        </Center>
        {ActiveStep}
        <Flex direction="HORIZONTAL" justify="SPACE_BETWEEN">
          <Visibility isVisible={step > 0}>
            <Button type="secondary" onClick={goToStep(step - 1)}>
              Précédent
            </Button>
          </Visibility>
          <Button
            type="primary"
            onClick={isLast ? lastStepButton.onClick : goToStep(step + 1)}
          >
            {isLast ? lastStepButton.text : "Suivant"}
          </Button>
        </Flex>
      </Grid>
    </Card>
  );
}
