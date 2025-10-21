import { Button } from "../../ui/Button/Button";
import type { ButtonProps } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { Heading } from "../../ui/Heading/Heading";
import { Illustration } from "../../ui/Illustration/Illustration";
import type { IllustrationName } from "../../ui/Illustration/private";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

export type NotFoundPageProps = {
  title: string;
  description?: string;
  illustration?: IllustrationName;
  actions: [ButtonProps, ...ButtonProps[]];
};

export function NotFountPage({
  title,
  description,
  illustration,
  actions,
}: NotFoundPageProps) {
  const { t } = useTranslation();

  return (
    <PageTemplate title={t("page.error.notFound.event")}>
      <Card>
        <Stack gap="m" alignItems="center" justifyContent="center">
          <Heading>{title}</Heading>
          {illustration && <Illustration name={illustration} />}
          {description && <Paragraph>{description}</Paragraph>}
          {actions.map((action) => (
            <Button key={action.label} {...action} />
          ))}
        </Stack>
      </Card>
    </PageTemplate>
  );
}
