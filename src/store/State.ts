import { _State as CurrentState, _stateDecoder as CurrentStateDecoder, _retrieve as currentRetrieve } from './v1/v1';

export const retrieve = currentRetrieve;
export const StateDecoder = CurrentStateDecoder;
export type State = CurrentState;
