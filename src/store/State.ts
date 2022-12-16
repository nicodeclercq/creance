import * as IO from 'io-ts';
import { Claim, retrieveClaim, ClaimDecoder } from './state/claim/claim';
import { User, retrieveUser, UserDecoder } from './state/user/user';

export type State = {
  lastUpdate: string,
  user: User;
  claims: Claim[];
};

type StateAccessor<A> = {
  retrieve: (currentState: unknown) => Promise<A>;
  decode: IO.Decoder<unknown, A>['decode'];
};

export const StateAccessor = {
  claim: {
    retrieve: retrieveClaim,
    decode: ClaimDecoder.decode,
  } as StateAccessor<Claim>,
  user: {
    retrieve: retrieveUser,
    decode: UserDecoder.decode,
  } as StateAccessor<Claim>,
} as const;