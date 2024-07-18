import { Spacing, SPACING } from "../../../entities/spacing";
import Pig from "./_icons/pig";
import Check from "./_icons/check";
import Add from "./_icons/add";
import User from "./_icons/user";
import ChevronDown from "./_icons/chevron-down";
import ChevronUp from "./_icons/chevron-up";
import ChevronRight from "./_icons/chevron-right";
import ChevronLeft from "./_icons/chevron-left";
import Cross from "./_icons/cross";
import Lock from "./_icons/lock";
import Flag from "./_icons/flag";
import Car from "./_icons/car";
import Cart from "./_icons/cart";
import Diner from "./_icons/dinner";
import Wine from "./_icons/wine";
import Camera from "./_icons/camera";
import Home from "./_icons/home";
import Running from "./_icons/running";
import Pencil from "./_icons/pencil";
import Note from "./_icons/note";
import Graph from "./_icons/graph";
import Stats from "./_icons/stats";
import Bill from "./_icons/bill";
import ArrowLeft from "./_icons/arrow-left";
import ArrowRight from "./_icons/arrow-right";
import Hamburger from "./_icons/hamburger";
import Trash from "./_icons/trash";
import Unlock from "./_icons/unlock";
import Archive from "./_icons/archive";
import Online from "./_icons/online";

export type IconName =
  | "ADD"
  | "ARCHIVE"
  | "ARROW_LEFT"
  | "ARROW_RIGHT"
  | "BILL"
  | "CAMERA"
  | "CAR"
  | "CART"
  | "CHECK"
  | "CHEVRON_DOWN"
  | "CHEVRON_LEFT"
  | "CHEVRON_RIGHT"
  | "CHEVRON_UP"
  | "CROSS"
  | "DINNER"
  | "FLAG"
  | "GRAPH"
  | "HAMBURGER"
  | "HOME"
  | "LOCK"
  | "NOTE"
  | "PENCIL"
  | "PIG"
  | "RUNNING"
  | "STATS"
  | "TRASH"
  | "UNLOCK"
  | "USER"
  | "WINE"
  | "ONLINE";

const icons: {
  [key in IconName]: (p: { animate: boolean }) => JSX.Element;
} = {
  PIG: Pig,
  CHECK: Check,
  ADD: Add,
  CHEVRON_DOWN: ChevronDown,
  CHEVRON_UP: ChevronUp,
  CHEVRON_RIGHT: ChevronRight,
  CHEVRON_LEFT: ChevronLeft,
  CROSS: Cross,
  FLAG: Flag,
  LOCK: Lock,
  USER: User,
  WINE: Wine,
  CAR: Car,
  CART: Cart,
  CAMERA: Camera,
  DINNER: Diner,
  HOME: Home,
  RUNNING: Running,
  PENCIL: Pencil,
  NOTE: Note,
  GRAPH: Graph,
  STATS: Stats,
  BILL: Bill,
  ARROW_LEFT: ArrowLeft,
  ARROW_RIGHT: ArrowRight,
  HAMBURGER: Hamburger,
  TRASH: Trash,
  UNLOCK: Unlock,
  ARCHIVE: Archive,
  ONLINE: Online,
};

export const ICONS = Object.keys(icons).reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: cur,
  }),
  {}
) as { [k in IconName]: IconName };

type Props = {
  name: IconName;
  size?: Spacing | "auto";
  animate?: boolean;
};
export function Icon({ name, size = "auto", animate = false }: Props) {
  const Component = icons[name];
  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: `calc(${
          size === "auto" ? "auto" : SPACING[size]
        } * var(--size-h-line, 1.2))`,
      }}
    >
      <Component animate={animate} />
    </div>
  );
}
