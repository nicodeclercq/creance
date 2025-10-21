import { useForm as useFormHook } from "react-hook-form";
import { type z } from "zod";
import { useTranslation } from "react-i18next";
import { createFormattedResolver } from "../service/validation";
export const useForm = <TFieldValues extends Record<string, any>>(
  schema: z.ZodSchema<TFieldValues>,
  form: Omit<Parameters<typeof useFormHook<TFieldValues>>[0], "resolver"> = {}
) => {
  const { t } = useTranslation();

  return useFormHook<TFieldValues>({
    ...form,
    resolver: createFormattedResolver(schema, t),
  });
};
