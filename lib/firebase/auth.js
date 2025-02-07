import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
  } from "firebase/auth";
  import { auth } from "./firebase";
  
  export function onAuthStateChanged(cb) {
      return _onAuthStateChanged(auth, cb);
  }
  
  export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('dddd', result._tokenResponse)
      return result._tokenResponse;
    } catch (error) {
      console.error("Error signing in with Google", error);
      return null;
    }
  }
  
  export async function signOut() {
    try {
      return auth.signOut();
    } catch (error) {
      console.error("Error signing out with Google", error);
    }
  }
