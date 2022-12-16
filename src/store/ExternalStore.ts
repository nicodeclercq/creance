import { Fn, LazyFn } from './../../@types/function';

import { Claim, ClaimDecoder } from "./state/claim/claim";
import { User, UserDecoder } from './state/user/user'; 

export type Decoders = {
  user: typeof UserDecoder;
  claim: typeof ClaimDecoder;
}

export type ExternalStore =  (decoders: Decoders) => {
  user: {
    create: Fn<User, Promise<void>>,
    read: Fn<string, Promise<User>>,
    update: Fn<User, Promise<void>>,
    delete: Fn<User, Promise<void>>,
  },
  claim: {
    create: Fn<Claim, Promise<void>>,
    read: Fn<string, Promise<Claim>>,
    update: Fn<Claim, Promise<void>>,
    delete: Fn<Claim, Promise<void>>,
  },
}