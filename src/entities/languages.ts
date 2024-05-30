import { ValueOf } from '../ValueOf.d';

export const LANGUAGES = {
  FR: 'fr', 
  EN: 'en'
} as const;

export type Language = ValueOf<typeof LANGUAGES>;