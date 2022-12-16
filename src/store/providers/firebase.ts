import { decrypt, encrypt } from './../../infrastructure/crypto';
import { pipe, constVoid, constant, identity } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';
import * as Either from 'fp-ts/Either';
import * as IO from 'io-ts';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, setDoc } from 'firebase/firestore/lite';

import { secrets } from "../../secrets";
import { ExternalStore } from "../ExternalStore";
import { throws } from '../../infrastructure/exception';
import { User, UserDecoder } from '../state/user/user';

const COLLECTION = {
  CLAIMS: 'creances',
  USERS: 'users',
}


const firebaseConfig = {
  apiKey: secrets.firebaseApiKey,
  authDomain: secrets.firebaseAuthDomain,
  projectId: secrets.firebaseProjectId,
  storageBucket: secrets.firebaseStorageBucket,
  messagingSenderId: secrets.firebaseMessagingSenderId,
  appId: secrets.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getCollection = (name: string) => Promise.resolve(collection(db, name));
const getDoc = (collection: string, name: string) => getCollection(collection)
  .then(getDocs)
  .then(({docs}) => docs)
  .then(docs => docs.filter(d => d.data().name === name))
  .then(docs => docs.length > 0
    ? Option.some(docs[0])
    : Option.none,
  );

const getUserCollection = () => getCollection(COLLECTION.USERS);
const getClaimCollection = () => getCollection(COLLECTION.CLAIMS);

const decode = <A extends IO.Decoder<any, any>>(decoder: A) => (value: string) => pipe(
  value,
  decoder.decode,
  Either.fold(
    throws,
    identity,
  )
);

const userStore = {
  create: (user: User) => getUserCollection()
    .then(collection => addDoc(collection, { id: user.id, value: encrypt(user.id)(JSON.stringify(user))}))
    .then(constVoid),
  read: (name: string) => getDoc(COLLECTION.USERS, name)
    .then(Option.map(doc => doc.get('value')))
    .then(Option.getOrElse(constant('')))
    .then(decrypt(name))
    .then(decode(UserDecoder)),
  update: (user: User) => getDoc(COLLECTION.USERS, user.id)
  .then(Option.fold(
    () => throws(new Error('User not found')),
    (doc) => setDoc(doc.ref, { name: COLLECTION.USERS, value: encrypt(user.id)(JSON.stringify(user))}),
  )),
  delete: (user: User) => getDoc(COLLECTION.USERS, user.id)
  .then(Option.fold(
    () => throws(new Error('User not found')),
    (doc) => deleteDoc(doc.ref),
  )),
} as const;

export const FirebaseStore: ExternalStore = (decoders) => ({
  user: userStore,
  claim: {
    create: (claim) => getClaimCollection()
      .then(collection => addDoc(collection, { id: claim.id, value: ''}))
      .then(constVoid),
    read: (name) => getDoc(COLLECTION.CLAIMS, name)
      .then(Option.map(doc => doc.get('value')))
      .then(Option.getOrElse(constant('')))
      .then(decrypt(name))
      .then(decode(decoders.claim)),
    update: (claim) => getDoc(COLLECTION.CLAIMS, claim.id)
      .then(Option.fold(
        () => throws(new Error('Claim not found')),
        (doc) => setDoc(doc.ref, { name: COLLECTION.CLAIMS, value: claim}),
      )),
    delete: (claim) => getDoc(COLLECTION.CLAIMS, claim.id)
      .then(Option.fold(
        () => throws(new Error('Claim not found')),
        (doc) => deleteDoc(doc.ref),
      ))
  },
});