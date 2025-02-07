// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// FIREBASE_API_KEY=AIzaSyAiW3_mOw2sz93oRN5oXm2utCWEo1Z_Yys
// FIREBASE_AUTH_DOMAIN=revenge-group.firebaseapp.com
// FIREBASE_PROJECT_ID=revenge-group
// FIREBASE_STORAGE_BUCKET=revenge-group.firebasestorage.app
// FIREBASE_MESSAGING_SENDER_ID=849427250519
// FIREBASE_APP_ID=1:849427250519:web:d53da5581e1748e5469212
const firebaseConfig = {

    // apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.FIREBASE_PROJECT_ID,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.FIREBASE_APP_ID
    apiKey: "AIzaSyAiW3_mOw2sz93oRN5oXm2utCWEo1Z_Yys",
    authDomain: "revenge-group.firebaseapp.com",
    projectId: "revenge-group",
    storageBucket: "revenge-group.firebasestorage.app",
    messagingSenderId: "849427250519",
    appId: "1:849427250519:web:d53da5581e1748e5469212"
};
console.log("firebaseConfig", firebaseConfig)
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);