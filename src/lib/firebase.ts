import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsYzFqVham-qQmkVCO1_YOPQF72h-XNOM",
  authDomain: "gen-lang-client-0417121436.firebaseapp.com",
  projectId: "gen-lang-client-0417121436",
  storageBucket: "gen-lang-client-0417121436.firebasestorage.app",
  messagingSenderId: "819327147259",
  appId: "1:819327147259:web:09c1161ab404200b3e245e"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safety validation connection to Firestore as outlined in Skill Guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration. Client is offline.");
    }
  }
}

testConnection();
