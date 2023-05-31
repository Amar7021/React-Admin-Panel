import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "admin-panel-66e52.firebaseapp.com",
  projectId: "admin-panel-66e52",
  storageBucket: "admin-panel-66e52.appspot.com",
  messagingSenderId: "760684335383",
  appId: "1:760684335383:web:876530ff6ce4f9d1ee6752",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
