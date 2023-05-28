import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import firebase from "firebase/compat/app";
// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyCkWK_HEG1b40Ghw1SV0pL924YZC54d_zA",
  authDomain: "make-me-vid.firebaseapp.com",
  projectId: "make-me-vid",
  storageBucket: "make-me-vid.appspot.com",
  messagingSenderId: "1092293478165",
  appId: "1:1092293478165:web:e2bba99c06edb1c0340b1c",
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();
export { firebase };
