import { initializeApp } from "firebase/app";
import { secrets } from "../../secrets";

export const app = initializeApp({
  apiKey: secrets.firebaseApiKey,
  authDomain: secrets.firebaseAuthDomain,
  projectId: secrets.firebaseProjectId,
  storageBucket: secrets.firebaseStorageBucket,
  messagingSenderId: secrets.firebaseMessagingSenderId,
  appId: secrets.firebaseAppId,
});
