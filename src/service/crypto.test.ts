import {
  decode,
  decrypt,
  encode,
  encrypt,
  exportKeyPair,
  generateKey,
  generateKeyPair,
  importKeys,
} from "./crypto";
import { describe, expect, it } from "vitest";

describe("Crypto Service", () => {
  it("should encrypt and decrypt a string", async () => {
    const keys = await generateKeyPair();
    const originalText = "Hello, World! Bonjour le monde!";

    const encoded = await encode(originalText, keys.publicKey);
    const decoded = await decode(encoded, keys.privateKey);

    expect(typeof encoded).toBe("string");
    expect(decoded).toBe(originalText);
  });

  it("can be exported and imported", async () => {
    const keys = await generateKeyPair();
    const exportedKeys = await exportKeyPair(keys);
    const importedKeys = await importKeys(exportedKeys);

    expect(typeof exportedKeys.publicKey).toBe("string");
    expect(typeof exportedKeys.privateKey).toBe("string");
    expect(importedKeys.publicKey).toEqual(keys.publicKey);
    expect(importedKeys.privateKey).toEqual(keys.privateKey);
  });

  it("should encrypt and decrypt a string with imported keys", async () => {
    const keys = await generateKeyPair();
    const originalText = "Hello, World! Bonjour le monde!";

    const exportedKeys = await exportKeyPair(keys);
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

  it("should throw an error if the key is invalid", async () => {
    const originalText = "Hello, World! Bonjour le monde!";
    const key1 = await generateKey("a");
    const key2 = await generateKey("b");
    const encoded = await encrypt(originalText, key1);
    await expect(decrypt(encoded, key2)).rejects.toThrow("Decryption failed");
  });
});

describe("generateKey", () => {
  it("should generate a key", async () => {
    const key1 = await generateKey("test");
    expect(typeof key1).toBe("string");
    const key2 = await generateKey("test");
    expect(key1).toBe(key2);
  });

  it("should generate different keys for different inputs", async () => {
    const key1 = await generateKey("b");
    const key2 = await generateKey("a");
    expect(key1).not.toBe(key2);
  });
});
