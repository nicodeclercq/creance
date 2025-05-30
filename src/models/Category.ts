import { CategoryIconName } from "../ui/CategoryIcon/private";
import { uid } from "../uid";

export type Category = {
  _id: string;
  name: string;
  icon: CategoryIconName;
};

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
