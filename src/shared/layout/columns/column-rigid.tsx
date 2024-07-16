import { Props as ColumnProps, __Column as Column } from "./__column";

type Props = Omit<ColumnProps, "grow" | "shrink">;

export function ColumnRigid(props: Props) {
  const newProps = { ...props, ...{ grow: false, shrink: false } };
  return <Column {...newProps} />;
}
