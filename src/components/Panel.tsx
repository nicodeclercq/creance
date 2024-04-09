import React from "react";
import { Panel as RawPanel } from "primereact/panel";
import { css } from "@emotion/css";
import { VAR } from "../theme/style";
import { IconName } from "./icons/Icon";
import { RouteName } from "../router";
import { Grid } from "./layout/grid";
import { Title } from "./text/title";
import { LinkAsIconButton } from "./LinkAsIconButton";

const headerStyle = css(`
  padding: ${VAR.SIZE.PADDING.VERTICAL.M} ${VAR.SIZE.PADDING.HORIZONTAL.M};
  background: ${VAR.COLOR.BRAND.MAIN.STRONGER};
  color: ${VAR.COLOR.BRAND.SURFACE.STRONG};
`);

export type Props = {
  title?: string;
  action?: {
    icon: IconName;
    title: string;
    to: RouteName;
  };
  children: React.ReactNode;
};

export function Panel({ title, action, children }: Props) {
  return (
    <RawPanel
      headerTemplate={
        title || action ? (
          <div className={headerStyle}>
            <Grid columns={["auto", "min-content"]} align="CENTER">
              {title && <Title inheritColor>{title}</Title>}
              {action && (
                <LinkAsIconButton
                  title={action.title}
                  type="secondary"
                  to={action.to}
                  icon={action.icon}
                  size="L"
                />
              )}
            </Grid>
          </div>
        ) : undefined
      }
    >
      {children}
    </RawPanel>
  );
}
