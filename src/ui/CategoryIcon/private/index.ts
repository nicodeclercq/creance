import { AxeIcon } from "./AxeIcon";
import { BallIcon } from "./BallIcon";
import { BasketIcon } from "./BasketIcon";
import { CameraIcon } from "./CameraIcon";
import { CarIcon } from "./CarIcon";
import { CartIcon } from "./CartIcon";
import { CoffeeIcon } from "./CoffeeIcon";
import { CoinIcon } from "./CoinIcon";
import { GroupIcon } from "./GroupIcon";
import { HeartIcon } from "./HeartIcon";
import { HouseIcon } from "./HouseIcon";
import { LetterIcon } from "./LetterIcon";
import { MapIcon } from "./MapIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PuzzleIcon } from "./PuzzleIcon";
import { SandglassIcon } from "./SandglassIcon";
import { ShirtIcon } from "./ShirtIcon";
import { SunIcon } from "./SunIcon";
import { UmbrellaIcon } from "./UmbrellaIcon";
import { UserFullIcon } from "./UserFullIcon";
import { UserIcon } from "./UserIcon";
import { WrenchIcon } from "./WrenchIcon";

export const CATEGORY_ICONS = {
  axe: {
    name: "component.categoryIcon.axe",
    component: AxeIcon,
  },
  ball: {
    name: "component.categoryIcon.ball",
    component: BallIcon,
  },
  basket: {
    name: "component.categoryIcon.basket",
    component: BasketIcon,
  },
  camera: {
    name: "component.categoryIcon.camera",
    component: CameraIcon,
  },
  car: {
    name: "component.categoryIcon.car",
    component: CarIcon,
  },
  cart: {
    name: "component.categoryIcon.cart",
    component: CartIcon,
  },
  coffee: {
    name: "component.categoryIcon.coffee",
    component: CoffeeIcon,
  },
  coin: {
    name: "component.categoryIcon.coin",
    component: CoinIcon,
  },
  group: {
    name: "component.categoryIcon.group",
    component: GroupIcon,
  },
  heart: {
    name: "component.categoryIcon.heart",
    component: HeartIcon,
  },
  house: {
    name: "component.categoryIcon.house",
    component: HouseIcon,
  },
  letter: {
    name: "component.categoryIcon.letter",
    component: LetterIcon,
  },
  map: {
    name: "component.categoryIcon.map",
    component: MapIcon,
  },
  phone: {
    name: "component.categoryIcon.phone",
    component: PhoneIcon,
  },
  puzzle: {
    name: "component.categoryIcon.puzzle",
    component: PuzzleIcon,
  },
  sandglass: {
    name: "component.categoryIcon.sandglass",
    component: SandglassIcon,
  },
  shirt: {
    name: "component.categoryIcon.shirt",
    component: ShirtIcon,
  },
  sun: {
    name: "component.categoryIcon.sun",
    component: SunIcon,
  },
  umbrella: {
    name: "component.categoryIcon.umbrella",
    component: UmbrellaIcon,
  },
  user: {
    name: "component.categoryIcon.user",
    component: UserIcon,
  },
  "user-full": {
    name: "component.categoryIcon.user-full",
    component: UserFullIcon,
  },
  wrench: {
    name: "component.categoryIcon.wrench",
    component: WrenchIcon,
  },
} as const;

export const CATEGORY_ICONS_NAMES = Object.keys(CATEGORY_ICONS) as [
  CategoryIconName,
  ...CategoryIconName[]
];
export type CategoryIconName = keyof typeof CATEGORY_ICONS;
