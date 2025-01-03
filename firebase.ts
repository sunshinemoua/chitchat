import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC75HD_0AkdndCciSPG6Q2wXyQ9g1nJMew",
  authDomain: "chitter-chatter-e06df.firebaseapp.com",
  projectId: "chitter-chatter-e06df",
  storageBucket: "chitter-chatter-e06df.firebasestorage.app",
  messagingSenderId: "487786044767",
  appId: "1:487786044767:web:a8007bf5552f4d302a2aea",
};

// Check if app has already been initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, auth, functions };
