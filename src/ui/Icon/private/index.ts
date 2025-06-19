import { AddIcon } from "./AddIcon";
import { CarretDownIcon } from "./CarretDownIcon";
import { CarretUpIcon } from "./CarretUpIcon";
import { CheckIcon } from "./CheckIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { CreditCardIcon } from "./CreditCardIcon";
import { EditIcon } from "./EditIcon";
import { ErrorIcon } from "./ErrorIcon";
import { ExchangeMoneyIcon } from "./ExchangeMoneyIcon";
import { FolderIcon } from "./FolderIcon";
import { GiveMoneyIcon } from "./GiveMoneyIcon";
import { HideIcon } from "./HideIcon";
import { LockIcon } from "./LockIcon";
import { MenuIcon } from "./MenuIcon";
import { MinusIcon } from "./MinusIcon";
import { PlusIcon } from "./PlusIcon";
import { ShoppingCartIcon } from "./ShoppingCartIcon";
import { ShowIcon } from "./ShowIcon";
import { TrashIcon } from "./TrashIcon";
import { UnlockIcon } from "./UnlockIcon";
import { UserAddIcon } from "./UserAddIcon";
import { UserGroupIcon } from "./UserGroupIcon";
import { UserIcon } from "./UserIcon";
import { UserShareIcon } from "./UserShareIcon";
import { WarningIcon } from "./WarningIcon";

export const ICONS = {
  add: AddIcon,
  "carret-down": CarretDownIcon,
  "carret-up": CarretUpIcon,
  check: CheckIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "credit-card": CreditCardIcon,
  edit: EditIcon,
  error: ErrorIcon,
  folder: FolderIcon,
  "give-money": GiveMoneyIcon,
  "exchange-money": ExchangeMoneyIcon,
  hide: HideIcon,
  lock: LockIcon,
  menu: MenuIcon,
  minus: MinusIcon,
  plus: PlusIcon,
  "shopping-cart": ShoppingCartIcon,
  show: ShowIcon,
  trash: TrashIcon,
  unlock: UnlockIcon,
  user: UserIcon,
  "user-add": UserAddIcon,
  "user-group": UserGroupIcon,
  "user-share": UserShareIcon,
  warning: WarningIcon,
} as const;

export type IconName = keyof typeof ICONS;
