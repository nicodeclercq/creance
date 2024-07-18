import { ReactNode } from "react";

import "./components-preview.css";

type Props = {
  label: string;
  children: ReactNode[] | ReactNode;
};

export function ComponentPreview({ label, children }: Props) {
  return (
    <div className="s-preview">
      <label>{label}</label>
      <div className="s-preview__content">{children}</div>
    </div>
  );
}
