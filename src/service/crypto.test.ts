import {
  decode,
  decrypt,
  encode,
  encrypt,
  exportKeys,
  generateKey,
  getKeys,
  importKeys,
} from "./crypto";
import { describe, expect, it } from "vitest";

describe("Crypto Service", () => {
  it("should encrypt and decrypt a string", async () => {
    const keys = await getKeys();
    const originalText = "Hello, World! Bonjour le monde!";

    const encoded = await encode(originalText, keys.publicKey);
    const decoded = await decode(encoded, keys.privateKey);

    expect(typeof encoded).toBe("string");
    expect(decoded).toBe(originalText);
  });

  it("can be exported and imported", async () => {
    const keys = await getKeys();
    const exportedKeys = await exportKeys(keys);
    const importedKeys = await importKeys(exportedKeys);

    expect(typeof exportedKeys.publicKey).toBe("string");
    expect(typeof exportedKeys.privateKey).toBe("string");
    expect(importedKeys.publicKey).toEqual(keys.publicKey);
    expect(importedKeys.privateKey).toEqual(keys.privateKey);
  });

  it("should encrypt and decrypt a string with imported keys", async () => {
    const keys = await getKeys();
    const originalText = "Hello, World! Bonjour le monde!";

    const exportedKeys = await exportKeys(keys);
    const importedKeys = await importKeys(exportedKeys);

    const encoded = await encode(originalText, importedKeys.publicKey);
    const decoded = await decode(encoded, importedKeys.privateKey);

    expect(typeof encoded).toBe("string");
    expect(decoded).toBe(originalText);
  });
});

describe("encrypt/decrypt", () => {
  it("should encrypt and decrypt a string", async () => {
    const originalText = "Hello, World! Bonjour le monde!";
    const key = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).toString("base64");

    const encoded = await encrypt(originalText, key);
    const decoded = await decrypt(encoded, key);

    expect(typeof encoded).toBe("string");
    expect(decoded).toBe(originalText);
  });
});

describe("generateKey", () => {
  it("should generate a key", async () => {
    const key = await generateKey();
    expect(typeof key).toBe("string");
    expect(key.length).toBeGreaterThan(0);
  });
});
