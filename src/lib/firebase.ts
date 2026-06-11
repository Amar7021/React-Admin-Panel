import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY || "",
  authDomain: "admin-panel-66e52.firebaseapp.com",
  projectId: "admin-panel-66e52",
  storageBucket: "admin-panel-66e52.appspot.com",
  messagingSenderId: "760684335383",
  appId: "1:760684335383:web:876530ff6ce4f9d1ee6752",
};

// Check if Firebase keys are provided and not dummy values
export const isFirebaseActive =
  !!firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR FIREBASE KEY" &&
  !firebaseConfig.apiKey.startsWith("YOUR");

let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.warn("Firebase initialization failed. Mock DB fallback will be used.", error);
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;
export { app };
