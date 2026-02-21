import * as z from "zod";

import { createMergeableRecord, mergeableRecord } from "./mergeable";

import { CATEGORY_ICONS_NAMES } from "../ui/CategoryIcon/private";
import type { CategoryIconName } from "../ui/CategoryIcon/private";
import { uid } from "../service/crypto";

export const categorySchema = mergeableRecord({
  _id: z.string().max(100, "Category.validation.id.maxLength"),
  name: z.string().max(100, "Category.validation.name.maxLength"),
  icon: z.enum(CATEGORY_ICONS_NAMES, "Category.validation.icon.invalid"),
});

export type Category = z.infer<typeof categorySchema>;

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "coin";

export const DEFAULT_CATEGORY: Category = createMergeableRecord({
  _id: uid(),
  icon: "coin",
  name: "categories.default",
});

export const DEFAULT_CATEGORIES: Category[] = [
  DEFAULT_CATEGORY,
  createMergeableRecord({
    _id: uid(),
    icon: "cart",
    name: "categories.shopping",
  }),
  createMergeableRecord({
    _id: uid(),
    icon: "house",
    name: "categories.accomodation",
  }),
  createMergeableRecord({
    _id: uid(),
    icon: "camera",
    name: "categories.visits",
  }),
];
