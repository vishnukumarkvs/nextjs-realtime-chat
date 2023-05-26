// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCciS7lDrV5BDKfhk2MwZe6mJaAJU8yQuo",
  authDomain: "nextjs-chat-272b3.firebaseapp.com",
  databaseURL: "https://nextjs-chat-272b3-default-rtdb.firebaseio.com",
  projectId: "nextjs-chat-272b3",
  storageBucket: "nextjs-chat-272b3.appspot.com",
  messagingSenderId: "624014183997",
  appId: "1:624014183997:web:4732c7672047f633fae454",
  measurementId: "G-F03K98V7VK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics =
  app.name && typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getDatabase(app);
