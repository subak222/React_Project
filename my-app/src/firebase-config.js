import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaKl6Yc1Zl9rA-UUdIMk8j0NRtAXAmYAw",
  authDomain: "sword-5dce6.firebaseapp.com",
  projectId: "sword-5dce6",
  storageBucket: "sword-5dce6.appspot.com",
  messagingSenderId: "738324109279",
  appId: "1:738324109279:web:5d71f7f393d5a5e9d9966a",
  measurementId: "G-J5KJVPRX1D"
};

const firestore = firebase.firestore();
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export {firestore};