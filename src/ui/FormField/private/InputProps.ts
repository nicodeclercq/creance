import { type FormFieldProps } from "../FormField";
export type InputProps<Name extends string, T> = {
  id?: string;
  type: Name;
  value: T;
  onChange: (newValue: T) => void;
  onBlur?: (newValue: T) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  ariaLabelledby?: string;
} & Omit<FormFieldProps, "id" | "children" | "isDisabled" | "isRequired">;
