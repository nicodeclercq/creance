export type StringValue = {
  _type: "StringValue";
  defaultValue: string;
  label: string;
  isRequired?: boolean;
  validate?: (a: string) => boolean;
  kind?: "text" | "password";
  autocomplete?: string;
};

export const stringValue = (
  options: Partial<StringValue> & { label: StringValue["label"] }
): StringValue => ({
  _type: "StringValue",
  defaultValue: "",
  kind: "text",
  ...options,
});

export type BooleanValue = {
  _type: "BooleanValue";
  defaultValue: boolean;
  label: string;
  isRequired?: boolean;
  validate?: (a: boolean) => boolean;
  kind: "checkbox";
};
export const booleanValue = (
  options: Partial<BooleanValue> & { label: BooleanValue["label"] }
): BooleanValue => ({
  _type: "BooleanValue",
  defaultValue: false,
  kind: "checkbox",
  ...options,
});

export type NumberValue = {
  _type: "NumberValue";
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
  _type: "NumberValue",
  defaultValue: 0,
  ...options,
});
export type PrimitiveValue = StringValue | NumberValue | BooleanValue;
export type FormValue =
  | PrimitiveValue
  | ValueFromList<PrimitiveValue>
  | ValuesFromList<PrimitiveValue>;

export type ValuesFromList<T extends PrimitiveValue> = Omit<
  T,
  "validate" | "defaultValue" | "_type"
> & {
  _type: "valuesFromList";
  _primitiveType: T["_type"];
  isMulti: true;
  defaultValue: T["defaultValue"][];
  options: T extends StringValue
    ? Array<{ label: string; value: string } | string>
    : Array<{ label: string; value: number } | number>;
  validate?: T extends StringValue
    ? (a: string) => boolean
    : (a: number) => boolean;
};

export const valuesFromList = <T extends PrimitiveValue>(
  { defaultValue, validate, ...primitive }: T,
  config: {
    options: ValuesFromList<T>["options"];
    defaultValue?: ValuesFromList<T>["defaultValue"];
    validate?: ValuesFromList<T>["validate"];
  }
) =>
  ({
    ...primitive,
    ...config,
    defaultValue: [] as T["defaultValue"][],
    isMulti: true,
    _type: "valuesFromList",
    _primitiveType: primitive._type,
  } as ValuesFromList<T>);

export type ValueFromList<T extends PrimitiveValue> = Omit<
  T,
  "validate" | "_type"
> & {
  _type: "valueFromList";
  _primitiveType: T["_type"];
  isMulti: false;
  options: T extends StringValue
    ? Array<{ label: string; value: string } | string>
    : Array<{ label: string; value: number } | number>;
  validate?: T extends StringValue
    ? (a: string) => boolean
    : (a: number) => boolean;
};

export const valueFromList = <T extends PrimitiveValue>(
  { validate, ...primitive }: T,
  config: {
    options: ValueFromList<T>["options"];
    validate?: ValueFromList<T>["validate"];
  }
) =>
  ({
    ...primitive,
    ...config,
    isMulti: false,
    _type: "valueFromList",
    _primitiveType: primitive._type,
  } as ValueFromList<T>);

export const isStringValue = (a: FormValue): a is StringValue =>
  a._type === "StringValue";
export const isBooleanValue = (a: FormValue): a is BooleanValue =>
  a._type === "BooleanValue";
export const isNumberValue = (a: FormValue): a is NumberValue =>
  a._type === "NumberValue";

export const isValuesFromList = <P extends PrimitiveValue>(
  a: FormValue,
  kind: P["_type"]
): a is ValuesFromList<P> =>
  a._type === "valuesFromList" && a._primitiveType === kind;

export const isValueFromList = <P extends PrimitiveValue>(
  a: FormValue,
  kind: P["_type"]
): a is ValueFromList<P> =>
  a._type === "valueFromList" && a._primitiveType === kind;

export type Fields<T extends { [key in string]: FormValue }> = {
  [key in keyof T]: T[key];
};

export type Values<T extends Fields<any>> = {
  [key in keyof T]: T[key]["defaultValue"];
};
export type Value<T extends Fields<any>, K extends keyof T> = Values<T>[K];

export type Key<T extends Fields<any>> = keyof T;
