import { createCacheWorkerClient } from "../workers/CacheWorkerClient";
import { salt } from "../secrets";

const CACHE_NAME = "creance-auth-keys";

export type SecureKeyStore = {
  store: (userKey: string) => Promise<void>;
  retrieve: () => Promise<string | undefined>;
  clear: () => Promise<void>;
};

const deriveWrappingKey = (): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  return crypto.subtle
    .importKey("raw", encoder.encode(salt), "PBKDF2", false, ["deriveKey"])
    .then((baseKey) =>
      crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("creance-key-wrap"),
          iterations: 100_000,
          hash: "SHA-256",
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
      ),
    );
};

const encryptValue = (
  wrappingKey: CryptoKey,
  plaintext: string,
): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle
    .encrypt(
      { name: "AES-GCM", iv },
      wrappingKey,
      new TextEncoder().encode(plaintext),
    )
    .then((ciphertext) =>
      JSON.stringify({
        iv: btoa(String.fromCharCode(...iv)),
        ct: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      }),
    );
};

const decryptValue = (
  wrappingKey: CryptoKey,
  encrypted: string,
): Promise<string> => {
  const { iv, ct } = JSON.parse(encrypted) as { iv: string; ct: string };
  const ivBytes = new Uint8Array(
    atob(iv)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );
  const ctBytes = new Uint8Array(
    atob(ct)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );
  return crypto.subtle
    .decrypt({ name: "AES-GCM", iv: ivBytes }, wrappingKey, ctBytes)
    .then((plaintext) => new TextDecoder().decode(plaintext));
};

export const createSecureKeyStore = (): SecureKeyStore => {
  const workerClient = createCacheWorkerClient(CACHE_NAME);
  const wrappingKeyPromise = deriveWrappingKey();
  let initialized = false;

  const ensureInit = (): Promise<void> =>
    initialized
      ? Promise.resolve()
      : workerClient.init().then(() => {
          initialized = true;
        });

  return {
    store: (userKey: string) =>
      Promise.all([ensureInit(), wrappingKeyPromise])
        .then(([, wrappingKey]) => encryptValue(wrappingKey, userKey))
        .then((encrypted) => workerClient.write(encrypted)),

    retrieve: () =>
      Promise.all([ensureInit(), wrappingKeyPromise])
        .then(([, wrappingKey]) =>
          workerClient.read().then((encrypted) =>
            encrypted != null
              ? decryptValue(wrappingKey, encrypted)
              : undefined,
          ),
        )
        .catch(() => undefined),

    clear: () => ensureInit().then(() => workerClient.clear()),
  };
};
