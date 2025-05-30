import { Illustration } from "../Illustration/Illustration";
import { type IllustrationName } from "../Illustration/private";
import { Stack } from "../Stack/Stack";
import { Paragraph } from "../Paragraph/Paragraph";
import { Heading } from "../Heading/Heading";
import { Button, ButtonProps } from "../Button/Button";
import { Card } from "../Card/Card";

type Props = {
  title: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  description: string;
  illustration: IllustrationName;
  action?: ButtonProps;
};

export function EmptyState({
  title,
  titleLevel = 1,
  description,
  illustration,
  action,
}: Props) {
  return (
    <Card>
      <Stack alignItems="center" justifyContent="center" gap="l" padding="l">
        <Heading level={titleLevel} styles={{ font: "body-large" }}>
          {title}
        </Heading>
        <Illustration name={illustration} size="m" />
        <Paragraph styles={{ color: "neutral-weak", textAlign: "center" }}>
          {description}
        </Paragraph>
        {action && <Button {...action} />}
      </Stack>
    </Card>
  );
}
