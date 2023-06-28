import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5y5xblS3TmxyT_Fp80HEpQgJ0GEoGJIk",
  authDomain: "quiz-4759b.firebaseapp.com",
  projectId: "quiz-4759b",
  storageBucket: "quiz-4759b.appspot.com",
  messagingSenderId: "623401422869",
  appId: "1:623401422869:web:35abf181a138b2982cfe1c",
  measurementId: "G-PJK526MR4S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore;

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
