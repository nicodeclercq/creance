import type { ContainerStyles } from "../Container/Container";
import { Container } from "../Container/Container";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/private";
import { Paragraph } from "../Paragraph/Paragraph";
type PillProps = {
  children: string;
  icon: IconName;
  color: "failure" | "warning" | "success";
};

const COLORS = {
  failure: { color: "failure-stronger", background: "failure-weaker" },
  warning: { color: "warning-stronger", background: "warning-weaker" },
  success: { color: "success-stronger", background: "success-weaker" },
} as const satisfies Record<
  PillProps["color"],
  { color: ContainerStyles["color"]; background: ContainerStyles["background"] }
>;

export function Pill({ children, icon, color }: PillProps) {
  return (
    <Container
      styles={{
        radius: "round",
        padding: "s",
        display: "inline-flex",
        gap: "s",
        font: "body-smaller",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS[color].background,
        color: COLORS[color].color,
      }}
    >
      <Icon name={icon} size="s" />
      <Paragraph>{children}</Paragraph>
    </Container>
  );
}
