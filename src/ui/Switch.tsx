import { Logger } from "../service/Logger";
import type { ReactNode } from "react";

type SwitchProps<T extends string> = {
  data: T;
} & Record<T, ReactNode>;

export function Switch<T extends string>({
  data,
  ...renderers
}: SwitchProps<T>) {
  if (data in renderers) {
    return renderers[data] as ReactNode;
  }

  Logger.warn("Data not found")(data);
  return null;
}
