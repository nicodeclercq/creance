import * as IO from 'io-ts';
import { pipe } from 'fp-ts/function';

import { retrieveFromVersion } from '../../infrastructure/store';
// import { ExternalStoreManager } from '../../service/ExternalStoreManager';

const version = 'V1';

export const _stateDecoder = IO.type({
  version: IO.literal(version),
});

export type _State = IO.TypeOf<typeof _stateDecoder>;

export const _defaultState: _State = {
  version,
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
    stateDecoder,
    () => pipe(
      currentState,
      s => update(s)
        .then((s) => {
          /*
          ExternalStoreManager.create(s.user.name)
            .catch((error) => {
              console.error('Unable to create user remotely', error);
            });
          */
          return s;
        }),
    )
  );
}