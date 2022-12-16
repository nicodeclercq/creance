import { _State, _stateDecoder, _retrieve } from './v1/v1';

export const retrieveUser = _retrieve;
export const UserDecoder = _stateDecoder;
export type User = _State;
