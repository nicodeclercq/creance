import { hasKey } from "../../infrastructure/object";

export type StringValue = {
  defaultValue: string;
  label: string;
  isRequired?: boolean;
  validate?: (a: string) => boolean;
  kind?: "text" | "password";
};
export const stringValue = (
  options: Partial<StringValue> & { label: StringValue["label"] }
): StringValue => ({
  defaultValue: "",
  kind: "text",
  ...options,
});

export type BooleanValue = {
  defaultValue: boolean;
  label: string;
  isRequired?: boolean;
  validate?: (a: boolean) => boolean;
  kind: "checkbox";
};
export const booleanValue = (
  options: Partial<BooleanValue> & { label: BooleanValue["label"] }
): BooleanValue => ({
  defaultValue: false,
  kind: "checkbox",
  ...options,
});

export type NumberValue = {
  defaultValue: number;
  isRequired?: boolean;
  label: string;
  min?: number;
  max?: number;
  validate?: (a: number) => boolean;
};
export const numberValue = (
  options: Partial<NumberValue> & { label: NumberValue["label"] }
): NumberValue => ({
  defaultValue: 0,
  ...options,
});
export type PrimitiveValue = StringValue | NumberValue | BooleanValue;
export type FormValue = PrimitiveValue | ValueFromList<PrimitiveValue>;

export type ValueFromList<T extends PrimitiveValue> = Omit<T, "validate"> & {
  isMulti: boolean;
  options: T extends StringValue
    ? Array<{ label: string; value: string } | string>
    : Array<{ label: string; value: number } | number>;
  validate?: T extends StringValue
    ? (a: string) => boolean
    : (a: number) => boolean;
};

export const isStringValue = (a: FormValue): a is StringValue =>
  typeof a.defaultValue === "string" && !("options" in a);
export const isBooleanValue = (a: FormValue): a is BooleanValue =>
  hasKey("kind", a) && a.kind === "checkbox";
export const isNumberValue = (a: FormValue): a is NumberValue =>
  typeof a.defaultValue === "number" && !("options" in a);

export const isValueFromList = <P extends PrimitiveValue>(
  a: FormValue
): a is ValueFromList<P> => "options" in a && "isMulti" in a && a["isMulti"];

export type Fields<T extends { [key in string]: FormValue }> = {
  [key in keyof T]: T[key];
};

export type Values<T extends Fields<any>> = {
  [key in keyof T]: T[key]["defaultValue"];
};
export type Value<T extends Fields<any>, K extends keyof T> = Values<T>[K];

export type Key<T extends Fields<any>> = keyof T;
