// ===== Shared Firebase setup for the AppMaker Egypt website promotions =====
// Reuses the SAME Firebase project as the clinic system (bookmydoctor-6c93c).
// No separate backend or accounts are created.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWsKLiMjUREhEpMZarud5j2K6rLDQqsSo",
  authDomain: "bookmydoctor-6c93c.firebaseapp.com",
  projectId: "bookmydoctor-6c93c",
  storageBucket: "bookmydoctor-6c93c.firebasestorage.app",
  messagingSenderId: "88063096613",
  appId: "1:88063096613:web:293c77b09078d943964ccc",
  measurementId: "G-VJ2PE37JSJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// The ONLY account allowed to manage promotions.
// This constant is a convenience for the admin page UI only — real enforcement
// lives in firestore.rules and storage.rules (same email there).
export const PROMO_ADMIN_EMAIL = "appmakeregypt@gmail.com";
