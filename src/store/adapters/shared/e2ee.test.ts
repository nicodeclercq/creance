import { decryptState, encryptState } from "./e2ee";
import { describe, expect, it } from "vitest";

import { generateKey } from "../../../service/crypto";

describe("encryptState / decryptState", () => {
  it("encrypts and decrypts state", () => {
    const state = { name: "Alice", count: 42 };

    return generateKey("test_password")
      .then((key) =>
        encryptState(state, key).then((encrypted) =>
          decryptState(encrypted, key),
        ),
      )
      .then((decrypted) => {
        expect(decrypted).toEqual(state);
      });
  });

  it("encrypted output is different from plaintext", () => {
    const state = { secret: "sensitive data" };

    return generateKey("password")
      .then((key) => encryptState(state, key))
      .then((encrypted) => {
        expect(encrypted).not.toContain("sensitive data");
        expect(encrypted).not.toContain("secret");
      });
  });

  it("decryption fails with wrong key", () => {
    const state = { data: "test" };

    return Promise.all([
      generateKey("password1"),
      generateKey("password2"),
    ]).then(([key1, key2]) =>
      encryptState(state, key1).then((encrypted) =>
        expect(decryptState(encrypted, key2)).rejects.toThrow(),
      ),
    );
  });

  it("produces different ciphertext for same plaintext (random IV)", () => {
    const state = { data: "same" };

    return generateKey("password").then((key) =>
      Promise.all([encryptState(state, key), encryptState(state, key)]).then(
        ([encrypted1, encrypted2]) => {
          expect(encrypted1).not.toBe(encrypted2);

          return Promise.all([
            decryptState(encrypted1, key),
            decryptState(encrypted2, key),
          ]).then(([decrypted1, decrypted2]) => {
            expect(decrypted1).toEqual(decrypted2);
          });
        },
      ),
    );
  });
});
