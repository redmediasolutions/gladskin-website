import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

console.log("🔥 Firebase Environment Variables");
console.log("PUBLIC_FIREBASE_API_KEY:", !!import.meta.env.PUBLIC_FIREBASE_API_KEY);
console.log("PUBLIC_FIREBASE_APP_ID:", !!import.meta.env.PUBLIC_FIREBASE_APP_ID);
console.log(
  "PUBLIC_FIREBASE_MESSAGING_SENDER_ID:",
  !!import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID
);
console.log("PUBLIC_FIREBASE_PROJECT_ID:", !!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID);
console.log("PUBLIC_FIREBASE_STORAGE_BUCKET:", !!import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET);

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error("❌ Missing Firebase environment variables:", missingKeys);
} else {
  console.log("✅ All Firebase environment variables loaded successfully.");
}

export const firebaseApp =
  getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp);