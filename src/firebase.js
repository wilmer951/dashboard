// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 👈 esto es clave

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJbDtP3qW2ZUtghNYD7zhm1AATowL9mAE",
  authDomain: "licencekey-4decc.firebaseapp.com",
  projectId: "licencekey-4decc",
  storageBucket: "licencekey-4decc.firebasestorage.app",
  messagingSenderId: "222839703815",
  appId: "1:222839703815:web:587dd6ba03bbefdba3dda2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar la instancia para usarla en otros archivos
export { db };
