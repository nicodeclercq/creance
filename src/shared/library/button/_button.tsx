import { ReactNode } from "react";
import { IconName, Icon } from "../icon/icon";
import { ColumnRigid } from "../../layout/columns/column-rigid";
import { ColumnFlexible } from "../../layout/columns/column-flexible";
import { Columns } from "../../layout/columns/columns";

type Props = {
  children: ReactNode;
  isSubmit?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onClick: () => void;
  className: string;
};
export function Button({
  isSubmit = false,
  children,
  iconLeft,
  iconRight,
  onClick,
  className,
}: Props) {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClick}
      className={className}
    >
      <Columns spacing="S" align="CENTER">
        {iconLeft && (
          <ColumnRigid contentFit>
            <Icon name={iconLeft} />
          </ColumnRigid>
        )}
        <ColumnFlexible>{children}</ColumnFlexible>
        {iconRight && (
          <ColumnRigid contentFit>
            <Icon name={iconRight} />
          </ColumnRigid>
        )}
      </Columns>
    </button>
  );
}
