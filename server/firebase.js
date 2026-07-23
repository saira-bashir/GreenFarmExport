const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth"); // <-- Auth import kiya

const firebaseConfig = {
  apiKey: "AIzaSyAJAMGRqNPTxnKducRf5dUXCNwq9TCFmVs",
  authDomain: "greenfarmexport-29602.firebaseapp.com",
  projectId: "greenfarmexport-29602",
  storageBucket: "greenfarmexport-29602.firebasestorage.app",
  messagingSenderId: "322438069752",
  appId: "1:322438069752:web:a340560768a04641376a0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // <-- Auth instance banaya

module.exports = { db, auth };