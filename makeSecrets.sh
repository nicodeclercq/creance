cat > ./src/secrets.ts << EOF
export const secrets = {
  salt: '$SALT',
  firebaseApiKey: '$FIREBASE_API_KEY',
  firebaseAuthDomain: '$FIREBASE_AUTH_DOMAIN',
  firebaseProjectId: '$FIREBASE_PROJECT_ID',
  firebaseStorageBucket: '$FIREBASE_STORAGE_BUCKET',
  firebaseMessagingSenderId: '$FIREBASE_MESSAGING_SENDER_ID',
  firebaseAppId: '$FIREBASE_APP_ID',
  firebaseCollectionId: '$FIREBASE_COLLECTION_ID',
};
EOF
