// Firebase configuration
// Store this in a separate file that's not exposed to public repositories


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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services for use in other scripts
const auth = firebase.auth();
const db = firebase.firestore();
