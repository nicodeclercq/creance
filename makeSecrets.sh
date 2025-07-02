cat > ./src/secrets.ts << EOF
export const salt = "$SALT";
export const firebaseConfig = {
  apiKey: "$FIREBASE_API_KEY",
  authDomain: "$FIREBASE_AUTH_DOMAIN",
  databaseURL: "$FIREBASE_DATABASE_URL",
  projectId: "$FIREBASE_PROJECT_ID",
  storageBucket: "$FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "$FIREBASE_MESSAGING_SENDER_ID",
  appId: "$FIREBASE_APP_ID",
  collections: {
    EVENTS: "$FIREBASE_COLLECTION_EVENTS",
    EXPENSES: "$FIREBASE_COLLECTION_EXPENSES",
    USERS: "$FIREBASE_COLLECTION_USERS",
    DEPOSITS: "$FIREBASE_COLLECTION_DEPOSITS",
    IDS: "$FIREBASE_COLLECTION_IDS",
  },
};
EOF
