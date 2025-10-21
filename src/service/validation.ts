import { type i18n } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver } from "react-hook-form";
import { type z } from "zod";
export const createFormattedResolver =
  <TFieldValues extends Record<string, any>>(
    schema: z.ZodSchema<TFieldValues>,
    t: i18n["t"],
  ): Resolver<TFieldValues> =>
  (data, context, options) =>
    Promise.resolve(zodResolver(schema as any))
      .then((resolver) => resolver(data, context, options))
      .then((result) => {
        if (result.errors) {
          const formattedErrors: Record<string, any> = {};

          Object.entries(result.errors).forEach(
            ([key, error]: [string, any]) => {
              if (error?.message) {
                formattedErrors[key] = {
                  ...error,
                  message: t(error.message),
                };
              }
            },
          );

          return {
            values: result.values,
            errors: formattedErrors,
          };
        }

        return result;
      });
