import { ExternalStore, CryptedExternalStore } from './ExternalStore';
import { encode, decode, decrypt, encrypt } from '../infrastructure/crypto';
import { State } from "./State";

export const encryptStore = (store: ExternalStore): CryptedExternalStore => ({
  getEntries: () => store.getEntries()
      .then((values: string[]) => values.map(decode)),
  create: (name: string) => store.create(encode(name)),
  read: (name: string) => store.read(encode(name))
      .then(decrypt(name)),
  update: (name: string, state: State) => store
    .update(
      encode(name),
      encrypt(name)(state)
    )
      .then(decrypt(name)),
  delete: (name: string) => store.delete(encode(name))
});
