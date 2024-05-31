// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyAOKaup3bW_Y22hGFTdPM_YEmV8tkBwfYg",
  authDomain: "swp391-milkstore.firebaseapp.com",
  projectId: "swp391-milkstore",
  storageBucket: "swp391-milkstore.appspot.com",
  messagingSenderId: "754344728547",
  appId: "1:754344728547:web:67aa503f2b759897eff2d6",
  measurementId: "G-4J8EEVQ5WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};