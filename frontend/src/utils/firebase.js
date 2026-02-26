// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth,GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cold-freezer-user-details.firebaseapp.com",
  projectId: "cold-freezer-user-details",
  storageBucket: "cold-freezer-user-details.firebasestorage.app",
  messagingSenderId: "712269774758",
  appId: "1:712269774758:web:7db0f3e4f4c854bb295967"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});
export { auth, provider };
