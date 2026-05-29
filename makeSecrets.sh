LAST_BUILT_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > ./src/secrets.ts << EOF
export const lastBuiltAt = "$LAST_BUILT_AT";
export const salt = "$SALT";
export const storageFileName = "$STORAGE_FILE_NAME";
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
    DELETED_EVENTS: "$FIREBASE_COLLECTION_DELETED_EVENTS",
    USERS: "$FIREBASE_COLLECTION_USERS",
    DEPOSITS: "$FIREBASE_COLLECTION_DEPOSITS",
    IDS: "$FIREBASE_COLLECTION_IDS",
  },
};
EOF
