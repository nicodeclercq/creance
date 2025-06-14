import { decode, encode, exportKeys, getKeys, importKeys } from "./crypto";
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
