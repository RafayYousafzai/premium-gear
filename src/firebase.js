import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDal-VGSXT_FPHx7u7lr54AyG4WPci6AgE",
  authDomain: "premiumgear-9f74c.firebaseapp.com",
  projectId: "premiumgear-9f74c",
  storageBucket: "premiumgear-9f74c.appspot.com",
  messagingSenderId: "890361173540",
  appId: "1:890361173540:web:fe3ad4d3857f9bed20eab1",
  measurementId: "G-M47S628JF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
