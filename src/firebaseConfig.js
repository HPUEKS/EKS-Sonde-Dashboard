import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCxdrRyC_Y9gnj7Rr4Y_y04J2uA_IB_LUk",
  authDomain: "hpu-eks-sonde.firebaseapp.com",
  databaseURL: "https://hpu-eks-sonde-default-rtdb.firebaseio.com",
  projectId: "hpu-eks-sonde",
  storageBucket: "hpu-eks-sonde.appspot.com",
  messagingSenderId: "417256486328",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export just the database
export { database, ref, onValue };
