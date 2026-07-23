import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore import kiya

const firebaseConfig = {
  apiKey: "AIzaSyAJAMGRqNPTxnKducRf5dUXCNwq9TCFmVs",
  authDomain: "greenfarmexport-29602.firebaseapp.com",
  projectId: "greenfarmexport-29602",
  storageBucket: "greenfarmexport-29602.firebasestorage.app",
  messagingSenderId: "322438069752",
  appId: "1:322438069752:web:a340560768a04641376a0d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore database export kar diya