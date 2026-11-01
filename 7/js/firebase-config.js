
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlBADqh9O2wBR1M6Mv-z2GslMlGSHtN3I",
  authDomain: "outdoor-destination-project.firebaseapp.com",
  projectId: "outdoor-destination-project",
  storageBucket: "outdoor-destination-project.firebasestorage.app",
  messagingSenderId: "131351195558",
  appId: "1:131351195558:web:16dea3d683a4a65131a967",
  measurementId: "G-ZHN0WNXH13"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

