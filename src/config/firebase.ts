import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCdiVmwpkc95iN8WCTAlK92LafkkBcwQfs",
  authDomain: "sistemafarias2025.firebaseapp.com",
  projectId: "sistemafarias2025",
  storageBucket: "sistemafarias2025.firebasestorage.app",
  messagingSenderId: "524858706892",
  appId: "1:524858706892:web:d66a3a07dd5af4d9d96b69",
  measurementId: "G-WXQ8NPFL79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);