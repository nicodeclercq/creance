import { salt } from "../secrets";

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
    cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))),
    iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
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

  const ivArray = new Uint8Array(
    atob(iv)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const cipherArray = new Uint8Array(
    atob(cipher)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  return {
    iv: ivArray,
    cipher: cipherArray.buffer,
  };
};

export const uid = () => crypto.randomUUID();

export const generateKey = (secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const saltedSecret = `${salt}${secret}${salt}`;
  const data = encoder.encode(saltedSecret);

  return crypto.subtle
    .digest("SHA-256", data)
    .then((hashBuffer) =>
      btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    );
};

export const generateKeyPair = () =>
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

export function exportKeyPair(keyPair: CryptoKeyPair) {
  return Promise.all([
    crypto.subtle.exportKey("spki", keyPair.publicKey),
    crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
  ])
    .then((keys) =>
      keys.map((key) => btoa(String.fromCharCode(...new Uint8Array(key))))
    )
    .then(([publicKey, privateKey]) => ({ publicKey, privateKey }));
}

export function importPublicKey(publicKey: string): Promise<CryptoKey> {
  const binaryString = atob(publicKey);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "spki",
    bytes.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

export function importPrivateKey(privateKey: string): Promise<CryptoKey> {
  const binaryString = atob(privateKey);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
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
    .then((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer))));
}

export function decode(str: string, privateKey: CryptoKey): Promise<string> {
  const binaryString = atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return crypto.subtle
    .decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      bytes.buffer
    )
    .then((buffer) => new TextDecoder().decode(buffer));
}

export const encrypt = async (plaintext: string, key: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPlaintext = new TextEncoder().encode(plaintext);

  const binaryString = atob(key);
  const keyBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    keyBytes[i] = binaryString.charCodeAt(i);
  }

  const secretKey = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer,
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

  const binaryString = atob(key);
  const keyBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    keyBytes[i] = binaryString.charCodeAt(i);
  }

  const secretKey = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer,
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
