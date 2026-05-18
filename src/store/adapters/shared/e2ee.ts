import { decrypt, encrypt } from "../../../service/crypto";

export const encryptState = (state: unknown, key: string): Promise<string> =>
  Promise.resolve()
    .then(() => JSON.stringify(state))
    .then((plaintext) => encrypt(plaintext, key));

export const decryptState = (
  ciphertext: string,
  key: string,
): Promise<unknown> =>
  Promise.resolve()
    .then(() => decrypt(ciphertext, key))
    .then((plaintext) => JSON.parse(plaintext));
