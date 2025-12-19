// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXaGdCsoNaBCedORsxEnziqCUfxhXca9Y",
    authDomain: "milanvanani29.firebaseapp.com",
    projectId: "milanvanani29",
    storageBucket: "milanvanani29.firebasestorage.app",
    messagingSenderId: "1086979569482",
    appId: "1:1086979569482:web:65230f770769e61363b3b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

export { auth, provider };