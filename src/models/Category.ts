import * as z from "zod";

import { CATEGORY_ICONS_NAMES } from "../ui/CategoryIcon/private";
import type { CategoryIconName } from "../ui/CategoryIcon/private";
import { uid } from "../service/crypto";

export const categorySchema = z.strictObject({
  _id: z.string().max(100, "Category.validation.id.maxLength"),
  name: z.string().max(100, "Category.validation.name.maxLength"),
  icon: z.enum(CATEGORY_ICONS_NAMES, "Category.validation.icon.invalid"),
});

export type Category = z.infer<typeof categorySchema>;

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "coin";

export const DEFAULT_CATEGORY = {
  _id: uid(),
  icon: "coin",
  name: "categories.default",
} as const;

export const DEFAULT_CATEGORIES: Category[] = [
  DEFAULT_CATEGORY,
  {
    _id: uid(),
    icon: "cart",
    name: "categories.shopping",
  },
  {
    _id: uid(),
    icon: "house",
    name: "categories.accomodation",
  },
  {
    _id: uid(),
    icon: "camera",
    name: "categories.visits",
  },
];
