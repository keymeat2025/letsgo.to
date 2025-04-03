import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

// Initialize Firebase (you need to add your Firebase configuration here)

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlYM8lU1844ushiA7A3FtQPEtreQjJ30I",
  authDomain: "letsgoto-a630e.firebaseapp.com",
  projectId: "letsgoto-a630e",
  storageBucket: "letsgoto-a630e.firebasestorage.app",
  messagingSenderId: "194513214154",
  appId: "1:194513214154:web:7825241b22095d7c43f233",
  measurementId: "G-N8CN6LM82S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signOut, onAuthStateChanged };
