
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBT-reYLtGQycKsHl-xl0KQ9aGNGjJlaDU",
  authDomain: "butterfly-flower-store.firebaseapp.com",
  projectId: "butterfly-flower-store",
  storageBucket: "butterfly-flower-store.firebasestorage.app",
  messagingSenderId: "949088048906",
  appId: "1:949088048906:web:e5aadf1f518844d6860cf3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
