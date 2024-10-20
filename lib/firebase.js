import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjmMR9L6tWyCm5mif46RZqMhhBLXcU574",
  authDomain: "multiplayer-tic-tac-toe-6670f.firebaseapp.com",
  projectId: "multiplayer-tic-tac-toe-6670f",
  storageBucket: "multiplayer-tic-tac-toe-6670f.appspot.com",
  messagingSenderId: "868756067376",
  appId: "1:868756067376:web:76f7126873867b4c4549f5",
  measurementId: "G-N95BDMRNCB"};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
