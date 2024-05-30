import { Props as ColumnProps, __Column as Column } from "./__column";

type Props = Omit<ColumnProps, "grow" | "shrink">;

export function ColumnFlexible(props: Props) {
  const newProps = { ...props, ...{ grow: true, shrink: true } };
  return <Column {...newProps} />;
}
