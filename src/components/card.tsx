import React from "react";
import { Card as RawCard } from "primereact/card";

export type Props = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

export function Card({ title, children }: Props) {
  return <RawCard title={title}>{children}</RawCard>;
}
