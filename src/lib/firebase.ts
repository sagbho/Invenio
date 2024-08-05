// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYNriv6YPB9Lw3AiAKySBQFHlK0Teefkg",
  authDomain: "invenio-ea792.firebaseapp.com",
  projectId: "invenio-ea792",
  storageBucket: "invenio-ea792.appspot.com",
  messagingSenderId: "545567880270",
  appId: "1:545567880270:web:f7aed90004d2242b0abf1f",
  measurementId: "G-JQPQQ3YZPT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export const db = getFirestore(app);
