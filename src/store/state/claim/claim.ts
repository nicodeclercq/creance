import { _State, _stateDecoder, _retrieve } from './v1/v1';

export const retrieveClaim = _retrieve;
export const ClaimDecoder = _stateDecoder;
export type Claim = _State;
