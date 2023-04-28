import { DeepPartial } from "./../../@types/deepPartial";
import { TOKEN } from "./tokens/tokens";
export type Theme = typeof TOKEN;
export type ThemeOverride = DeepPartial<Theme>;
