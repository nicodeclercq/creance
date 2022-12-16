import * as IO from 'io-ts';

import { retrieveFromVersion } from '../../../../infrastructure/store';

const version = 'V1';

export const _stateDecoder = IO.type({
  version: IO.literal(version),  
  id: IO.string,
  claims: IO.array(
    IO.type({
      key: IO.string,
      id: IO.string,
    })
  )
});

export type _State = IO.TypeOf<typeof _stateDecoder>;

export const _defaultState: _State = {
  version,
  id: '',
  claims: [],
};

function update(_currentState: unknown): Promise<_State> {
  return Promise.resolve()
    .then(() => ({
      ..._defaultState,
    }) as _State);
}

export function _retrieve(currentState: unknown): Promise<_State> {
  return retrieveFromVersion(
    version,
    currentState,
    _stateDecoder,
    () => update(currentState)
  );
}