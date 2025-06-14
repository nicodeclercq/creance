export const getKeys = () =>
  crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

export function exportKeys(keyPair: CryptoKeyPair) {
  return Promise.all([
    crypto.subtle.exportKey("spki", keyPair.publicKey),
    crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
  ])
    .then((keys) => keys.map((key) => Buffer.from(key).toString("base64url")))
    .then(([publicKey, privateKey]) => ({ publicKey, privateKey }));
}

export function importPublicKey(publicKey: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "spki",
    Buffer.from(publicKey, "base64url"),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

export function importPrivateKey(privateKey: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKey, "base64url"),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export function importKeys({
  publicKey,
  privateKey,
}: {
  publicKey: string;
  privateKey: string;
}): Promise<CryptoKeyPair> {
  return Promise.all([
    importPublicKey(publicKey),
    importPrivateKey(privateKey),
  ]).then(([publicKey, privateKey]) => ({
    publicKey,
    privateKey,
  }));
}

export function encode(str: string, publicKey: CryptoKey): Promise<string> {
  return crypto.subtle
    .encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      new TextEncoder().encode(str)
    )
    .then((buffer) => Buffer.from(buffer).toString("base64url"));
}

export function decode(str: string, privateKey: CryptoKey): Promise<string> {
  return crypto.subtle
    .decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      Buffer.from(str, "base64")
    )
    .then((buffer) => new TextDecoder().decode(buffer));
}
