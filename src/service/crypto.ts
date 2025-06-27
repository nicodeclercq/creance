const split = (str: string, index: number): [string, string] => {
  return [str.slice(0, index), str.slice(index)];
};
const getRandomNb = ({
  min = 0,
  max,
}: {
  max: number;
  min?: number;
}): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const toStr = (cipher: ArrayBuffer, iv: Uint8Array<ArrayBuffer>): string => {
  const elements = {
    cipher: Buffer.from(cipher).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
  const index = getRandomNb({ min: 0, max: 9 });
  const [A, rest] = split(elements.cipher, 2);
  const [B, C] = split(rest, index);

  return `${A}${index.toString(16)}${B}${elements.iv}${C}`;
};

const fromStr = (
  str: string
): { cipher: ArrayBuffer; iv: Uint8Array<ArrayBuffer> } => {
  const [A, rest] = split(str, 2);
  const [index, rest2] = split(rest, 1);
  const [B, rest3] = split(rest2, Number.parseInt(index, 16));
  const [iv, C] = split(rest3, 16);
  const cipher = `${A}${B}${C}`;

  return {
    iv: Buffer.from(iv, "base64"),
    cipher: Buffer.from(cipher, "base64"),
  };
};

export const uid = () => crypto.randomUUID();

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

export const encrypt = async (plaintext: string, key: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPlaintext = new TextEncoder().encode(plaintext);
  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(key, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    secretKey,
    encodedPlaintext
  );
  return toStr(ciphertext, iv);
};

export const decrypt = async (str: string, key: string) => {
  const { cipher, iv } = fromStr(str);
  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(key, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    secretKey,
    cipher
  );
  return new TextDecoder().decode(decrypted);
};
