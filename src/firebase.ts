// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ15mXJlWQ5no_c52100Qf9SR2C7rTW7U",
  authDomain: "boomi-countdown.firebaseapp.com",
  projectId: "boomi-countdown",
  storageBucket: "boomi-countdown.firebasestorage.app",
  messagingSenderId: "521150273698",
  appId: "1:521150273698:web:ec53637a0b06f680cd9ffb",
  measurementId: "G-Y9VNB3GNRT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Skapar en Firestore-instans kopplad till appen
export const db = getFirestore(app);

// (valfritt) exportera app om du behöver den senare
export default app;
