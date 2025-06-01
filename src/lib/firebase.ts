// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAN_pb-ZbAKNuC8tIrJAhfj5ng07wlNMxU",
  authDomain: "daily-report-app-d5a4e.firebaseapp.com",
  projectId: "daily-report-app-d5a4e",
  storageBucket: "daily-report-app-d5a4e.firebasestorage.app",
  messagingSenderId: "446303763449",
  appId: "1:446303763449:web:1fca302782c256a0fb5b28"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);