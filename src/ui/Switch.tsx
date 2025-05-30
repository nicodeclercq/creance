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

  console.warn(data, "not found");
  return null;
}
