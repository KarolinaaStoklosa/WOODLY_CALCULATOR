import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Dodaj ten import


const firebaseConfig = {
  apiKey: "AIzaSyAZMalqmclX4Fulb0iFKrrM62UoGf8biGo",
  authDomain: "woodly-calculator.firebaseapp.com",
  projectId: "woodly-calculator",
  storageBucket: "woodly-calculator.firebasestorage.app",
  messagingSenderId: "773606677537",
  appId: "1:773606677537:web:f359802f2e6e16e33ad760"
};

const app = initializeApp(firebaseConfig);

// Eksportujemy usługi, z których będziemy korzystać
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. Zainicjalizuj i wyeksportuj storage

export default app;