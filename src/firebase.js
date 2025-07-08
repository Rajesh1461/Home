// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg7gBQunyj3VWb4J9Kz9kAARguTbymo7I",
  authDomain: "home-ac80e.firebaseapp.com",
  projectId: "home-ac80e",
  storageBucket: "home-ac80e.firebasestorage.app",
  messagingSenderId: "698082465788",
  appId: "1:698082465788:web:0a9f2b8ae8097e3d324479",
  measurementId: "G-MLVZT716T1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 