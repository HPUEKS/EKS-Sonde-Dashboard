import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// ✅ Correct Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxdrRyC_Y9gnj7Rr4Y_y04J2uA_IB_LUk",
  authDomain: "hpu-eks-sonde.firebaseapp.com",
  databaseURL: "https://hpu-eks-sonde-default-rtdb.firebaseio.com", // ✅ Correct database URL
  projectId: "hpu-eks-sonde",
  storageBucket: "hpu-eks-sonde.appspot.com", // ✅ Fixed storage bucket URL
  messagingSenderId: "417256486328",
  appId: "1:417256486328:web:2ce10f49287d4ccfc58b4d",
  measurementId: "G-KS2PZ60NMD"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // ✅ Add Realtime Database support
const analytics = getAnalytics(app);

// ✅ Export database references
export { database, ref, onValue };
